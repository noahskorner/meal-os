import { expect, test } from "@playwright/test";
import {
  createRecipe,
  createUserIngredient,
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

test.describe("GET /api/recipes/:recipeId", () => {
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
        recipeId: id,
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
          userIngredientId: null,
          name: request.recipeIngredients?.[0]?.name,
          quantity: request.recipeIngredients?.[0]?.quantity,
          unitId: request.recipeIngredients?.[0]?.unitId,
          preparation: request.recipeIngredients?.[0]?.preparation,
          note: null,
          isOptional: request.recipeIngredients?.[0]?.isOptional,
          ingredient: {
            id: request.recipeIngredients?.[0]?.ingredientId,
            name: request.recipeIngredients?.[0]?.name,
          },
          userIngredient: null,
        }),
      ],
      steps: [
        expect.objectContaining({
          text: request.recipeSteps?.[0]?.text,
          sortOrder: request.recipeSteps?.[0]?.sortOrder,
        }),
        expect.objectContaining({
          text: request.recipeSteps?.[1]?.text,
          sortOrder: request.recipeSteps?.[1]?.sortOrder,
        }),
      ],
    });
  });

  test("recipe ingredients can resolve user ingredient details", async ({
    baseURL,
  }) => {
    const apiClient = createTestApiClient(baseURL);
    const userIngredientName = `Fermented Chili Paste ${Date.now()}`;
    const userIngredientResult = await createUserIngredient({
      client: apiClient,
      body: {
        name: userIngredientName,
      },
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });

    const userIngredient = {
      id: userIngredientResult.data?.id ?? "",
      name: userIngredientName,
    };

    const createResult = await createRecipe({
      client: apiClient,
      body: {
        name: "Spicy Noodles",
        recipeIngredients: [
          {
            userIngredientId: userIngredient.id,
            name: userIngredient.name,
            quantity: 1,
          },
        ],
      },
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });

    expect(createResult.response?.status).toBe(201);

    const recipeId = createResult.data?.id;

    if (!recipeId) {
      throw new Error("Expected recipe creation to return a recipe id.");
    }

    const result = await getRecipe({
      client: apiClient,
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
      path: {
        recipeId,
      },
    });

    expect(result.response?.status).toBe(200);
    expect(result.data?.ingredients).toEqual([
      expect.objectContaining({
        ingredientId: null,
        userIngredientId: userIngredient.id,
        name: userIngredient.name,
        ingredient: null,
        userIngredient: {
          id: userIngredient.id,
          name: userIngredient.name,
        },
      }),
    ]);
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
        recipeId: id,
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
        recipeId: id,
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
        recipeId: "99999999-9999-4999-8999-999999999999",
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
