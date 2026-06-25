import { expect, test } from "@playwright/test";
import {
  createRecipe,
  listRecipes,
  type CreateRecipeRequest,
} from "@repo/web-api-client";
import { createAuthHeaders, createTestApiClient } from "../../../api-client";
import { E2E_TEST_USERS } from "../../../test-users";

function createRecipeRequest(name: string): CreateRecipeRequest {
  return {
    name,
    description: `Metadata for ${name}.`,
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 4,
  };
}

test.describe("GET /api/recipes", () => {
  test("authenticated user can list their recipes", async ({ baseURL }) => {
    const apiClient = createTestApiClient(baseURL);
    const recipeName = `Listable Pasta ${crypto.randomUUID()}`;
    const createResult = await createRecipe({
      client: apiClient,
      body: createRecipeRequest(recipeName),
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });

    expect(createResult.response?.status).toBe(201);

    const result = await listRecipes({
      client: apiClient,
      query: {
        page: 1,
        pageSize: 20,
      },
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });

    expect(result.response?.status).toBe(200);
    expect(result.response?.headers.get("content-type")).toContain(
      "application/json",
    );
    expect(result.data?.page).toBe(1);
    expect(result.data?.pageSize).toBe(20);
    expect(result.data?.totalItems).toBeGreaterThanOrEqual(1);
    expect(result.data?.totalPages).toBeGreaterThanOrEqual(1);
    expect(result.data?.items).toEqual(
      expect.arrayContaining([
        {
          id: createResult.data?.id,
          name: recipeName,
          description: `Metadata for ${recipeName}.`,
          prepTimeMinutes: 10,
          cookTimeMinutes: 20,
          servings: 4,
        },
      ]),
    );
  });

  test("users cannot see recipes created by other users", async ({
    baseURL,
  }) => {
    const apiClient = createTestApiClient(baseURL);
    const visibleRecipeName = `Visible Pasta ${crypto.randomUUID()}`;
    const hiddenRecipeName = `Hidden Pasta ${crypto.randomUUID()}`;
    const visibleRecipe = await createRecipe({
      client: apiClient,
      body: createRecipeRequest(visibleRecipeName),
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });
    const hiddenRecipe = await createRecipe({
      client: apiClient,
      body: createRecipeRequest(hiddenRecipeName),
      headers: createAuthHeaders(E2E_TEST_USERS.secondary.id),
    });

    expect(visibleRecipe.response?.status).toBe(201);
    expect(hiddenRecipe.response?.status).toBe(201);

    const result = await listRecipes({
      client: apiClient,
      query: {
        page: 1,
        pageSize: 20,
      },
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });
    const recipeIds = result.data?.items.map((recipe) => recipe.id) ?? [];

    expect(result.response?.status).toBe(200);
    expect(recipeIds).toContain(visibleRecipe.data?.id);
    expect(recipeIds).not.toContain(hiddenRecipe.data?.id);
  });

  test("authenticated user can page through their recipes", async ({
    baseURL,
  }) => {
    const apiClient = createTestApiClient(baseURL);
    const groupName = `! Paged Pasta ${crypto.randomUUID()}`;
    const createdRecipes = await Promise.all(
      ["03", "01", "02"].map((suffix) =>
        createRecipe({
          client: apiClient,
          body: createRecipeRequest(`${groupName} ${suffix}`),
          headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
        }),
      ),
    );

    for (const createdRecipe of createdRecipes) {
      expect(createdRecipe.response?.status).toBe(201);
    }

    const firstPage = await listRecipes({
      client: apiClient,
      query: {
        page: 1,
        pageSize: 2,
      },
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });
    const secondPage = await listRecipes({
      client: apiClient,
      query: {
        page: 2,
        pageSize: 2,
      },
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });
    const firstPageRecipeIds =
      firstPage.data?.items.map((recipe) => recipe.id) ?? [];
    const secondPageRecipeIds =
      secondPage.data?.items.map((recipe) => recipe.id) ?? [];

    expect(firstPage.response?.status).toBe(200);
    expect(firstPage.data?.page).toBe(1);
    expect(firstPage.data?.pageSize).toBe(2);
    expect(firstPage.data?.items).toHaveLength(2);
    expect(firstPage.data?.totalItems).toBeGreaterThanOrEqual(3);
    expect(firstPage.data?.totalPages).toBeGreaterThanOrEqual(2);

    expect(secondPage.response?.status).toBe(200);
    expect(secondPage.data?.page).toBe(2);
    expect(secondPage.data?.pageSize).toBe(2);
    expect(secondPage.data?.items.length).toBeLessThanOrEqual(2);
    for (const recipeId of secondPageRecipeIds) {
      expect(firstPageRecipeIds).not.toContain(recipeId);
    }
  });

  test("authenticated user can fuzzy search their recipes by name", async ({
    baseURL,
  }) => {
    const apiClient = createTestApiClient(baseURL);
    const matchingRecipeName = `Skillet Chicken Parmesan ${crypto.randomUUID()}`;
    const nonMatchingRecipeName = `Blueberry Pancakes ${crypto.randomUUID()}`;
    const matchingRecipe = await createRecipe({
      client: apiClient,
      body: createRecipeRequest(matchingRecipeName),
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });
    const nonMatchingRecipe = await createRecipe({
      client: apiClient,
      body: createRecipeRequest(nonMatchingRecipeName),
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });

    expect(matchingRecipe.response?.status).toBe(201);
    expect(nonMatchingRecipe.response?.status).toBe(201);

    const result = await listRecipes({
      client: apiClient,
      query: {
        searchTerm: "chicken parmesn",
        page: 1,
        pageSize: 20,
      },
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });

    expect(result.response?.status).toBe(200);
    expect(result.data?.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: matchingRecipe.data?.id,
          name: matchingRecipeName,
        }),
      ]),
    );
    expect(result.data?.items.map((recipe) => recipe.id)).not.toContain(
      nonMatchingRecipe.data?.id,
    );
    expect(result.data?.totalItems).toBeGreaterThanOrEqual(1);
  });

  test("rejects invalid query parameters", async ({ baseURL }) => {
    const result = await listRecipes({
      client: createTestApiClient(baseURL),
      query: {
        page: 0,
        pageSize: 101,
      },
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });

    expect(result.response?.status).toBe(400);
    expect(result.response?.headers.get("content-type")).toContain(
      "application/json",
    );
    expect(result.error).toEqual({
      message: "Invalid query parameters.",
      issues: [
        "page: Too small: expected number to be >0",
        "pageSize: Too big: expected number to be <=100",
      ],
    });
  });

  test("unauthenticated requests receive 401 unauthorized", async ({
    baseURL,
  }) => {
    const result = await listRecipes({
      client: createTestApiClient(baseURL),
      query: {
        page: 1,
        pageSize: 20,
      },
    });

    expect(result.response?.status).toBe(401);
    expect(result.response?.headers.get("content-type")).toContain(
      "application/json",
    );
    expect(result.error).toEqual({
      message: "Authentication required.",
    });
  });
});
