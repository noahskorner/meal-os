import { expect, test } from "@playwright/test";
import {
  createUserIngredient,
  getUserIngredient,
  listIngredients,
} from "@repo/web-api-client";
import { createAuthHeaders, createTestApiClient } from "../../../api-client";
import { E2E_TEST_USERS } from "../../../test-users";

test.describe("GET /api/user-ingredients/:userIngredientId", () => {
  test("authenticated user can get their own user ingredient", async ({
    baseURL,
  }) => {
    const apiClient = createTestApiClient(baseURL);
    const name = `Family Spice Blend ${Date.now()}`;
    const createResult = await createUserIngredient({
      client: apiClient,
      body: {
        name,
      },
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });

    const id = createResult.data?.id;

    if (!id) {
      throw new Error("Expected user ingredient creation to return an id.");
    }

    const result = await getUserIngredient({
      client: apiClient,
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
      path: {
        userIngredientId: id,
      },
    });

    expect(result.response?.status).toBe(200);
    expect(result.response?.headers.get("content-type")).toContain(
      "application/json",
    );
    expect(result.data).toEqual({
      id,
      name,
      categoryId: null,
      defaultUnitId: null,
      category: null,
      defaultUnit: null,
    });
  });

  test("returns category and default unit when available", async ({
    baseURL,
  }) => {
    const apiClient = createTestApiClient(baseURL);
    const ingredientsResult = await listIngredients({
      client: apiClient,
      query: {
        searchTerm: "Bell Pepper",
      },
    });
    const ingredient = ingredientsResult.data?.items.find(
      ({ name }) => name === "Bell Pepper",
    );

    if (!ingredient) {
      throw new Error("Expected Bell Pepper to exist in ingredient search.");
    }

    const name = `Custom Produce ${Date.now()}`;
    const createResult = await createUserIngredient({
      client: apiClient,
      body: {
        name,
        categoryId: ingredient.category.id,
        defaultUnitId: ingredient.defaultUnit.id,
      },
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });

    const id = createResult.data?.id;

    if (!id) {
      throw new Error("Expected user ingredient creation to return an id.");
    }

    const result = await getUserIngredient({
      client: apiClient,
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
      path: {
        userIngredientId: id,
      },
    });

    expect(result.response?.status).toBe(200);
    expect(result.data).toEqual({
      id,
      name,
      categoryId: ingredient.category.id,
      defaultUnitId: ingredient.defaultUnit.id,
      category: ingredient.category,
      defaultUnit: ingredient.defaultUnit,
    });
  });

  test("rejects unauthenticated requests", async ({ baseURL }) => {
    const result = await getUserIngredient({
      client: createTestApiClient(baseURL),
      path: {
        userIngredientId: "550e8400-e29b-41d4-a716-446655440010",
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

  test("returns 404 for user ingredients owned by another user", async ({
    baseURL,
  }) => {
    const apiClient = createTestApiClient(baseURL);
    const createResult = await createUserIngredient({
      client: apiClient,
      body: {
        name: `Private Ingredient ${Date.now()}`,
      },
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });

    const id = createResult.data?.id;

    if (!id) {
      throw new Error("Expected user ingredient creation to return an id.");
    }

    const result = await getUserIngredient({
      client: apiClient,
      headers: createAuthHeaders(E2E_TEST_USERS.secondary.id),
      path: {
        userIngredientId: id,
      },
    });

    expect(result.response?.status).toBe(404);
    expect(result.response?.headers.get("content-type")).toContain(
      "application/json",
    );
    expect(result.error).toEqual({
      message: "User ingredient not found.",
    });
  });
});
