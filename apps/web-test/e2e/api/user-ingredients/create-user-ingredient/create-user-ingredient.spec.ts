import { expect, test } from "@playwright/test";
import {
  createUserIngredient,
  getUserIngredient,
  listIngredients,
} from "@repo/web-api-client";
import { createAuthHeaders, createTestApiClient } from "../../../api-client";
import { E2E_TEST_USERS } from "../../../test-users";

test.describe("POST /api/user-ingredients", () => {
  test("authenticated user can create a user ingredient", async ({
    baseURL,
  }) => {
    const apiClient = createTestApiClient(baseURL);
    const name = `Family Spice Blend ${Date.now()}`;

    const result = await createUserIngredient({
      client: apiClient,
      body: {
        name,
      },
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
    expect(result.data?.location).toBe(
      `/api/user-ingredients/${result.data?.id}`,
    );
    expect(location).toBe(result.data?.location);

    const userIngredientId = result.data?.id;

    if (!userIngredientId) {
      throw new Error("Expected user ingredient creation to return an id.");
    }

    const fetchResult = await getUserIngredient({
      client: apiClient,
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
      path: {
        userIngredientId,
      },
    });

    expect(fetchResult.response?.status).toBe(200);
    expect(fetchResult.data).toEqual({
      id: userIngredientId,
      name,
      categoryId: null,
      defaultUnitId: null,
      category: null,
      defaultUnit: null,
    });
  });

  test("authenticated user can create a user ingredient with category and default unit", async ({
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
    const result = await createUserIngredient({
      client: apiClient,
      body: {
        name,
        categoryId: ingredient.category.id,
        defaultUnitId: ingredient.defaultUnit.id,
      },
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });

    expect(result.response?.status).toBe(201);
    expect(result.response?.headers.get("location")).toBe(
      result.data?.location,
    );
    expect(result.data?.location).toBe(
      `/api/user-ingredients/${result.data?.id}`,
    );

    const userIngredientId = result.data?.id;

    if (!userIngredientId) {
      throw new Error("Expected user ingredient creation to return an id.");
    }

    const fetchResult = await getUserIngredient({
      client: apiClient,
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
      path: {
        userIngredientId,
      },
    });

    expect(fetchResult.response?.status).toBe(200);
    expect(fetchResult.data).toEqual({
      id: userIngredientId,
      name,
      categoryId: ingredient.category.id,
      defaultUnitId: ingredient.defaultUnit.id,
      category: ingredient.category,
      defaultUnit: ingredient.defaultUnit,
    });
  });

  test("unauthenticated requests receive 401 unauthorized", async ({
    baseURL,
  }) => {
    const result = await createUserIngredient({
      client: createTestApiClient(baseURL),
      body: {
        name: "Family Spice Blend",
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

  test("client-supplied createdById does not override the authenticated user", async ({
    baseURL,
  }) => {
    const apiClient = createTestApiClient(baseURL);
    const name = `Protected User Ingredient ${Date.now()}`;

    const result = await apiClient.post<{
      201: {
        id: string;
        location: string;
      };
    }>({
      url: "/api/user-ingredients",
      body: {
        createdById: E2E_TEST_USERS.secondary.id,
        name,
      },
      headers: {
        "Content-Type": "application/json",
        ...createAuthHeaders(E2E_TEST_USERS.primary.id),
      },
    });

    expect(result.response?.status).toBe(201);
    expect(result.response?.headers.get("location")).toBe(
      result.data?.location,
    );

    const userIngredientId = result.data?.id;

    if (!userIngredientId) {
      throw new Error("Expected user ingredient creation to return an id.");
    }

    const primaryFetchResult = await getUserIngredient({
      client: apiClient,
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
      path: {
        userIngredientId,
      },
    });

    expect(primaryFetchResult.response?.status).toBe(200);
    expect(primaryFetchResult.data?.name).toBe(name);

    const secondaryFetchResult = await getUserIngredient({
      client: apiClient,
      headers: createAuthHeaders(E2E_TEST_USERS.secondary.id),
      path: {
        userIngredientId,
      },
    });

    expect(secondaryFetchResult.response?.status).toBe(404);
  });

  test("rejects invalid request bodies", async ({ baseURL }) => {
    const result = await createUserIngredient({
      client: createTestApiClient(baseURL),
      body: {
        name: "",
      },
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });

    expect(result.response?.status).toBe(400);
    expect(result.response?.headers.get("content-type")).toContain(
      "application/json",
    );
    expect(result.error).toEqual({
      message: "Invalid request body.",
      issues: ["name: Too small: expected string to have >=1 characters"],
    });
  });
});
