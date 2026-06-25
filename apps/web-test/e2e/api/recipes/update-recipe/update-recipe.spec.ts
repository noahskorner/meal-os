import { expect, test } from "@playwright/test";
import {
  createRecipe,
  getRecipe,
  listIngredients,
  updateRecipe,
  type Client,
  type CreateRecipeRequest,
  type ListIngredientResponse,
  type UpdateRecipeRequest,
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
    name: "Original Pasta",
    description: "Recipe created for update-recipe coverage.",
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

test.describe("PUT /api/recipes/:id", () => {
  test("authenticated user can update their own recipe", async ({
    baseURL,
  }) => {
    const apiClient = createTestApiClient(baseURL);
    const garlic = await getIngredient(apiClient, "Garlic");
    const oliveOil = await getIngredient(apiClient, "Olive Oil");
    const { id } = await createTestRecipe(apiClient, E2E_TEST_USERS.primary.id);

    const request: UpdateRecipeRequest = {
      name: "Updated Pasta",
      description: "Updated recipe after a pantry check.",
      prepTimeMinutes: 20,
      cookTimeMinutes: 10,
      servings: 2,
      recipeIngredients: [
        {
          ingredientId: oliveOil.id,
          name: oliveOil.name,
          quantity: 3,
          unitId: oliveOil.defaultUnit.id,
          note: "Finish with a drizzle.",
          isOptional: false,
        },
      ],
      recipeSteps: [
        {
          ingredientId: oliveOil.id,
          text: "Warm the olive oil gently.",
          sortOrder: 0,
        },
      ],
    };

    const updateResult = await updateRecipe({
      client: apiClient,
      body: request,
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
      path: {
        id,
      },
    });

    expect(updateResult.response?.status).toBe(204);
    expect(updateResult.data).toBeNull();

    const recipeResult = await getRecipe({
      client: apiClient,
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
      path: {
        id,
      },
    });

    expect(recipeResult.response?.status).toBe(200);
    expect(recipeResult.data).toMatchObject({
      id,
      name: request.name,
      description: request.description,
      prepTimeMinutes: request.prepTimeMinutes,
      cookTimeMinutes: request.cookTimeMinutes,
      servings: request.servings,
      steps: [
        expect.objectContaining({
          ingredientId: oliveOil.id,
          text: "Warm the olive oil gently.",
          sortOrder: 0,
        }),
      ],
    });
    expect(recipeResult.data?.ingredients).toHaveLength(1);
    expect(recipeResult.data?.ingredients).toEqual([
      expect.objectContaining({
        ingredientId: oliveOil.id,
        name: oliveOil.name,
        quantity: 3,
        unitId: oliveOil.defaultUnit.id,
        preparation: null,
        note: "Finish with a drizzle.",
        isOptional: false,
      }),
    ]);
    expect(
      recipeResult.data?.ingredients.some(
        (ingredient) => ingredient.ingredientId === garlic.id,
      ),
    ).toBe(false);
  });

  test("users cannot update recipes created by other users", async ({
    baseURL,
  }) => {
    const apiClient = createTestApiClient(baseURL);
    const { id, request: originalRequest } = await createTestRecipe(
      apiClient,
      E2E_TEST_USERS.secondary.id,
    );

    const updateResult = await updateRecipe({
      client: apiClient,
      body: {
        name: "Unauthorized Update Attempt",
      },
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
      path: {
        id,
      },
    });

    expect(updateResult.response?.status).toBe(404);
    expect(updateResult.response?.headers.get("content-type")).toContain(
      "application/json",
    );
    expect(updateResult.error).toEqual({
      message: "Recipe not found.",
    });

    const recipeResult = await getRecipe({
      client: apiClient,
      headers: createAuthHeaders(E2E_TEST_USERS.secondary.id),
      path: {
        id,
      },
    });

    expect(recipeResult.response?.status).toBe(200);
    expect(recipeResult.data).toMatchObject({
      id,
      name: originalRequest.name,
      description: originalRequest.description,
      prepTimeMinutes: originalRequest.prepTimeMinutes,
      cookTimeMinutes: originalRequest.cookTimeMinutes,
      servings: originalRequest.servings,
    });
  });

  test("unauthenticated requests return 401", async ({ baseURL }) => {
    const apiClient = createTestApiClient(baseURL);
    const { id } = await createTestRecipe(apiClient, E2E_TEST_USERS.primary.id);

    const result = await updateRecipe({
      client: apiClient,
      body: {
        name: "Anonymous Update Attempt",
      },
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
});
