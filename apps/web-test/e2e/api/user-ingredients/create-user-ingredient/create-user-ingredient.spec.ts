import { expect, test } from "@playwright/test";
import {
  createUserIngredient,
  listIngredients,
} from "@repo/web-api-client";
import { createAuthHeaders, createTestApiClient } from "../../../api-client";
import { getTestPrismaClient } from "../../../prisma-client";
import { E2E_TEST_USERS } from "../../../test-users";

test.describe("POST /api/user-ingredients", () => {
  test("authenticated user can create a user ingredient", async ({
    baseURL,
  }) => {
    const apiClient = createTestApiClient(baseURL);
    const prisma = await getTestPrismaClient();
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
    expect(result.data?.location).toBe(`/api/user-ingredients/${result.data?.id}`);
    expect(location).toBe(result.data?.location);

    const persistedUserIngredient = await prisma.userIngredient.findUnique({
      where: {
        id: result.data?.id,
      },
      select: {
        id: true,
        name: true,
        createdById: true,
        categoryId: true,
        defaultUnitId: true,
      },
    });

    expect(persistedUserIngredient).toEqual({
      id: result.data?.id,
      name,
      createdById: E2E_TEST_USERS.primary.id,
      categoryId: null,
      defaultUnitId: null,
    });
  });

  test("authenticated user can create a user ingredient with category and default unit", async ({
    baseURL,
  }) => {
    const apiClient = createTestApiClient(baseURL);
    const prisma = await getTestPrismaClient();
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
    expect(result.response?.headers.get("location")).toBe(result.data?.location);
    expect(result.data?.location).toBe(
      `/api/user-ingredients/${result.data?.id}`,
    );

    const persistedUserIngredient = await prisma.userIngredient.findUnique({
      where: {
        id: result.data?.id,
      },
      select: {
        categoryId: true,
        defaultUnitId: true,
      },
    });

    expect(persistedUserIngredient).toEqual({
      categoryId: ingredient.category.id,
      defaultUnitId: ingredient.defaultUnit.id,
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
    const prisma = await getTestPrismaClient();
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
    expect(result.response?.headers.get("location")).toBe(result.data?.location);

    const persistedUserIngredient = await prisma.userIngredient.findUnique({
      where: {
        id: result.data?.id,
      },
      select: {
        createdById: true,
      },
    });

    expect(persistedUserIngredient?.createdById).toBe(E2E_TEST_USERS.primary.id);
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
