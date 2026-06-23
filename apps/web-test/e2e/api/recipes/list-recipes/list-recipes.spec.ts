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
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });

    expect(result.response?.status).toBe(200);
    expect(result.response?.headers.get("content-type")).toContain(
      "application/json",
    );
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
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });
    const recipeIds = result.data?.items.map((recipe) => recipe.id) ?? [];

    expect(result.response?.status).toBe(200);
    expect(recipeIds).toContain(visibleRecipe.data?.id);
    expect(recipeIds).not.toContain(hiddenRecipe.data?.id);
  });

  test("unauthenticated requests receive 401 unauthorized", async ({
    baseURL,
  }) => {
    const result = await listRecipes({
      client: createTestApiClient(baseURL),
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
