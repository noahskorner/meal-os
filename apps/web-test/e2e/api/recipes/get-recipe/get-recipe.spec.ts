import { expect, test } from "@playwright/test";
import {
  createRecipe,
  getRecipe,
  listIngredients,
  type Client,
  type CreateRecipeRequest,
  type ListIngredientResponse,
} from "@repo/web-api-client";
import { createAuthHeaders, createTestApiClient } from "../../../api-client";
import { E2E_TEST_USERS } from "../../../test-users";

async function getIngredient(
  client: Client,
  searchTerm: string,
): Promise<ListIngredientResponse> {
  const result = await listIngredients({
    client,
    query: {
      searchTerm,
    },
  });
  const ingredient = result.data?.items.find(
    (item) => item.name === searchTerm,
  );

  if (!ingredient) {
    throw new Error(`Expected ${searchTerm} to exist in ingredient search.`);
  }

  return ingredient;
}

async function createTestRecipe(
  client: Client,
  userId: string,
): Promise<{ id: string; request: CreateRecipeRequest }> {
  const garlic = await getIngredient(client, "Garlic");

  const request: CreateRecipeRequest = {
    name: "Get Recipe Pasta",
    description: "Recipe created for get-recipe coverage.",
    prepTimeMinutes: 12,
    cookTimeMinutes: 18,
    servings: 3,
    recipeIngredients: [
      {
        ingredientId: garlic.id,
        name: garlic.name,
        quantity: 2,
        unitId: garlic.defaultUnit.id,
        preparation: "minced",
        isOptional: false,
      },
    ],
    recipeSteps: [
      {
        ingredientId: garlic.id,
        text: "Cook garlic until fragrant.",
        sortOrder: 0,
      },
      {
        text: "Serve immediately.",
        sortOrder: 1,
      },
    ],
  };

  const result = await createRecipe({
    client,
    body: request,
    headers: createAuthHeaders(userId),
  });

  if (!result.data) {
    throw new Error("Expected recipe creation to return a recipe id.");
  }

  return {
    id: result.data.id,
    request,
  };
}

test.describe("GET /api/recipes/:id", () => {
  test("authenticated user can get their own recipe", async ({ baseURL }) => {
    const apiClient = createTestApiClient(baseURL);
    const { id, request } = await createTestRecipe(
      apiClient,
      E2E_TEST_USERS.primary.id,
    );

    const result = await getRecipe({
      client: apiClient,
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
      path: {
        id,
      },
    });

    expect(result.response?.status).toBe(200);
    expect(result.response?.headers.get("content-type")).toContain(
      "application/json",
    );
    expect(result.data).toMatchObject({
      id,
      name: request.name,
      description: request.description,
      prepTimeMinutes: request.prepTimeMinutes,
      cookTimeMinutes: request.cookTimeMinutes,
      servings: request.servings,
      ingredients: [
        expect.objectContaining({
          ingredientId: request.recipeIngredients?.[0]?.ingredientId,
          name: request.recipeIngredients?.[0]?.name,
          quantity: request.recipeIngredients?.[0]?.quantity,
          unitId: request.recipeIngredients?.[0]?.unitId,
          preparation: request.recipeIngredients?.[0]?.preparation,
          note: null,
          isOptional: request.recipeIngredients?.[0]?.isOptional,
        }),
      ],
      steps: [
        expect.objectContaining({
          ingredientId: request.recipeSteps?.[0]?.ingredientId,
          text: request.recipeSteps?.[0]?.text,
          sortOrder: request.recipeSteps?.[0]?.sortOrder,
        }),
        expect.objectContaining({
          ingredientId: null,
          text: request.recipeSteps?.[1]?.text,
          sortOrder: request.recipeSteps?.[1]?.sortOrder,
        }),
      ],
    });
  });

  test("users cannot get recipes created by other users", async ({
    baseURL,
  }) => {
    const apiClient = createTestApiClient(baseURL);
    const { id } = await createTestRecipe(
      apiClient,
      E2E_TEST_USERS.secondary.id,
    );

    const result = await getRecipe({
      client: apiClient,
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
      path: {
        id,
      },
    });

    expect(result.response?.status).toBe(404);
    expect(result.response?.headers.get("content-type")).toContain(
      "application/json",
    );
    expect(result.error).toEqual({
      message: "Recipe not found.",
    });
  });

  test("unauthenticated requests return 401", async ({ baseURL }) => {
    const apiClient = createTestApiClient(baseURL);
    const { id } = await createTestRecipe(
      apiClient,
      E2E_TEST_USERS.primary.id,
    );

    const result = await getRecipe({
      client: apiClient,
      path: {
        id,
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

  test("missing recipes return 404", async ({ baseURL }) => {
    const result = await getRecipe({
      client: createTestApiClient(baseURL),
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
      path: {
        id: "99999999-9999-4999-8999-999999999999",
      },
    });

    expect(result.response?.status).toBe(404);
    expect(result.response?.headers.get("content-type")).toContain(
      "application/json",
    );
    expect(result.error).toEqual({
      message: "Recipe not found.",
    });
  });
});
