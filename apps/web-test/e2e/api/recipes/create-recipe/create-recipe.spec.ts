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

test.describe("POST /api/recipes", () => {
  test("authenticated user can create a recipe", async ({ baseURL }) => {
    const apiClient = createTestApiClient(baseURL);
    const garlic = await getIngredient(apiClient, "Garlic");
    const oliveOil = await getIngredient(apiClient, "Olive Oil");

    const recipeRequest: CreateRecipeRequest = {
      name: "Weeknight Pasta",
      description: "Simple pasta with garlic and olive oil.",
      prepTimeMinutes: 10,
      cookTimeMinutes: 15,
      servings: 4,
      recipeIngredients: [
        {
          ingredientId: garlic.id,
          name: garlic.name,
          quantity: 2,
          unitId: garlic.defaultUnit.id,
          preparation: "minced",
          isOptional: false,
        },
        {
          ingredientId: oliveOil.id,
          name: oliveOil.name,
          quantity: 1,
          unitId: oliveOil.defaultUnit.id,
          note: "Use extra virgin if available.",
        },
      ],
      recipeSteps: [
        {
          text: "Saute the garlic in olive oil until fragrant.",
          sortOrder: 0,
          ingredientId: garlic.id,
        },
        {
          text: "Toss with cooked pasta and serve warm.",
          sortOrder: 1,
        },
      ],
    };

    const result = await createRecipe({
      client: apiClient,
      body: recipeRequest,
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });

    expect(result.response?.status).toBe(201);
    expect(result.response?.headers.get("content-type")).toContain(
      "application/json",
    );

    const location = result.response?.headers.get("location");

    expect(result.data?.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(result.data?.location).toBe(`/api/recipes/${result.data?.id}`);
    expect(location).toBe(result.data?.location);

    const recipeResult = await getRecipe({
      client: apiClient,
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
      path: {
        id: result.data?.id ?? "",
      },
    });

    expect(recipeResult.response?.status).toBe(200);
    expect(recipeResult.data).toEqual({
      id: result.data?.id,
      name: recipeRequest.name,
      description: recipeRequest.description,
      prepTimeMinutes: recipeRequest.prepTimeMinutes,
      cookTimeMinutes: recipeRequest.cookTimeMinutes,
      servings: recipeRequest.servings,
      ingredients: expect.arrayContaining([
        expect.objectContaining({
          ingredientId: garlic.id,
          name: garlic.name,
          quantity: 2,
          unitId: garlic.defaultUnit.id,
          preparation: "minced",
          note: null,
          isOptional: false,
        }),
        expect.objectContaining({
          ingredientId: oliveOil.id,
          name: oliveOil.name,
          quantity: 1,
          unitId: oliveOil.defaultUnit.id,
          preparation: null,
          note: "Use extra virgin if available.",
          isOptional: null,
        }),
      ]),
      steps: [
        expect.objectContaining({
          ingredientId: garlic.id,
          text: "Saute the garlic in olive oil until fragrant.",
          sortOrder: 0,
        }),
        expect.objectContaining({
          ingredientId: null,
          text: "Toss with cooked pasta and serve warm.",
          sortOrder: 1,
        }),
      ],
    });
  });

  test("unauthenticated requests receive 401 unauthorized", async ({
    baseURL,
  }) => {
    const recipeRequest: CreateRecipeRequest = {
      name: "Weeknight Pasta",
    };

    const result = await createRecipe({
      client: createTestApiClient(baseURL),
      body: recipeRequest,
    });

    expect(result.response?.status).toBe(401);
    expect(result.response?.headers.get("content-type")).toContain(
      "application/json",
    );
    expect(result.error).toEqual({
      message: "Authentication required.",
    });
  });

  test("successful creation returns 201 and a resource location pointer", async ({
    baseURL,
  }) => {
    const recipeRequest: CreateRecipeRequest = {
      name: "Tomato Soup",
    };

    const result = await createRecipe({
      client: createTestApiClient(baseURL),
      body: recipeRequest,
      headers: createAuthHeaders(E2E_TEST_USERS.secondary.id),
    });

    expect(result.response?.status).toBe(201);

    const location = result.response?.headers.get("location");

    expect(location).toBeTruthy();
    expect(location).toBe(`/api/recipes/${result.data?.id}`);
    expect(result.data?.location).toBe(location);
  });
});
