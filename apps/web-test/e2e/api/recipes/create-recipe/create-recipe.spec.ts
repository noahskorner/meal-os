import { expect, test, type APIRequestContext } from "@playwright/test";
import type {
  CreateRecipeRequest,
  CreateRecipeResponse,
  ListIngredientResponse,
  ListIngredientsResponse,
} from "@repo/web-api-client";
import { MOCK_AUTH_USER_ID_HEADER } from "../../../../../web/src/app/features/auth/mock-auth.constants";
import { E2E_TEST_USERS } from "../../../test-users";

async function getIngredient(
  request: APIRequestContext,
  searchTerm: string,
): Promise<ListIngredientResponse> {
  const response = await request.get(
    `/api/ingredients?searchTerm=${encodeURIComponent(searchTerm)}`,
  );
  const body = (await response.json()) as ListIngredientsResponse;
  const ingredient = body.items.find((item) => item.name === searchTerm);

  if (!ingredient) {
    throw new Error(`Expected ${searchTerm} to exist in ingredient search.`);
  }

  return ingredient;
}

test.describe("POST /api/recipes", () => {
  test("authenticated user can create a recipe", async ({ request }) => {
    const garlic = await getIngredient(request, "Garlic");
    const oliveOil = await getIngredient(request, "Olive Oil");

    const requestBody: CreateRecipeRequest = {
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

    const response = await request.post("/api/recipes", {
      data: requestBody,
      headers: {
        [MOCK_AUTH_USER_ID_HEADER]: E2E_TEST_USERS.primary.id,
      },
    });

    expect(response.status()).toBe(201);
    expect(response.headers()["content-type"]).toContain("application/json");

    const body = (await response.json()) as CreateRecipeResponse;
    const location = response.headers()["location"];

    expect(body.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(body.location).toBe(`/api/recipes/${body.id}`);
    expect(location).toBe(body.location);
  });

  test("unauthenticated requests receive 401 unauthorized", async ({
    request,
  }) => {
    const response = await request.post("/api/recipes", {
      data: {
        name: "Weeknight Pasta",
      },
    });

    expect(response.status()).toBe(401);
    expect(response.headers()["content-type"]).toContain("application/json");
    await expect(response.json()).resolves.toEqual({
      message: "Authentication required.",
    });
  });

  test("successful creation returns 201 and a resource location pointer", async ({
    request,
  }) => {
    const response = await request.post("/api/recipes", {
      data: {
        name: "Tomato Soup",
      },
      headers: {
        [MOCK_AUTH_USER_ID_HEADER]: E2E_TEST_USERS.secondary.id,
      },
    });

    expect(response.status()).toBe(201);

    const body = (await response.json()) as CreateRecipeResponse;
    const location = response.headers()["location"];

    expect(location).toBeTruthy();
    expect(location).toBe(`/api/recipes/${body.id}`);
    expect(body.location).toBe(location);
  });
});
