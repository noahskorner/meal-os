import { expect, test } from "@playwright/test";
import {
  createMealPlan,
  createRecipe,
  type CreateMealPlanRequest,
  type CreateRecipeRequest,
} from "@repo/web-api-client";
import { createAuthHeaders, createTestApiClient } from "../../../api-client";
import { getTestPrismaClient } from "../../../prisma-client";
import { E2E_TEST_USERS } from "../../../test-users";

async function createTestRecipe(
  baseURL: string | undefined,
  userId: string,
  name: string,
): Promise<string> {
  const request: CreateRecipeRequest = {
    name,
  };
  const result = await createRecipe({
    client: createTestApiClient(baseURL),
    body: request,
    headers: createAuthHeaders(userId),
  });

  if (!result.data?.id) {
    throw new Error("Expected recipe creation to return a recipe id.");
  }

  return result.data.id;
}

test.describe("POST /api/meal-plans", () => {
  test("authenticated user can create a meal plan with recipe-backed and empty days", async ({
    baseURL,
  }) => {
    const firstRecipeId = await createTestRecipe(
      baseURL,
      E2E_TEST_USERS.primary.id,
      `Meal Plan Pasta ${Date.now()}`,
    );
    const secondRecipeId = await createTestRecipe(
      baseURL,
      E2E_TEST_USERS.primary.id,
      `Meal Plan Soup ${Date.now()}`,
    );

    const request: CreateMealPlanRequest = {
      entries: [
        {
          date: "2026-07-01",
          recipeIds: [firstRecipeId, secondRecipeId],
        },
        {
          date: "2026-07-02",
        },
        {
          date: "2026-07-03",
          recipeIds: [secondRecipeId],
        },
      ],
    };

    const result = await createMealPlan({
      client: createTestApiClient(baseURL),
      body: request,
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });

    expect(result.response?.status).toBe(201);
    expect(result.response?.headers.get("content-type")).toContain(
      "application/json",
    );
    expect(result.data?.location).toBe(`/api/meal-plans/${result.data?.id}`);
    expect(result.response?.headers.get("location")).toBe(result.data?.location);

    const prisma = await getTestPrismaClient();
    const mealPlan = await prisma.mealPlan.findUnique({
      where: {
        id: result.data?.id ?? "",
      },
      select: {
        id: true,
        createdById: true,
        entries: {
          orderBy: {
            date: "asc",
          },
          select: {
            date: true,
            mealPlanEntryRecipes: {
              orderBy: {
                sortOrder: "asc",
              },
              select: {
                recipeId: true,
                sortOrder: true,
              },
            },
          },
        },
      },
    });

    expect(mealPlan).not.toBeNull();
    expect(mealPlan?.createdById).toBe(E2E_TEST_USERS.primary.id);
    expect(
      mealPlan?.entries.map((entry) => ({
        date: entry.date.toISOString().slice(0, 10),
        recipeIds: entry.mealPlanEntryRecipes.map((recipe) => recipe.recipeId),
      })),
    ).toEqual([
      {
        date: "2026-07-01",
        recipeIds: [firstRecipeId, secondRecipeId],
      },
      {
        date: "2026-07-02",
        recipeIds: [],
      },
      {
        date: "2026-07-03",
        recipeIds: [secondRecipeId],
      },
    ]);
  });

  test("unauthenticated requests receive 401 unauthorized", async ({
    baseURL,
  }) => {
    const request: CreateMealPlanRequest = {
      entries: [
        {
          date: "2026-07-01",
        },
      ],
    };

    const result = await createMealPlan({
      client: createTestApiClient(baseURL),
      body: request,
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
