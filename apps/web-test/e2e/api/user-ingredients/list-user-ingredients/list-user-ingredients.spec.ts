import { expect, test } from "@playwright/test";
import {
  createUserIngredient,
  listUserIngredients,
} from "@repo/web-api-client";
import { createAuthHeaders, createTestApiClient } from "../../../api-client";
import { E2E_TEST_USERS } from "../../../test-users";

test.describe("GET /api/user-ingredients", () => {
  test("authenticated user can list their user ingredients", async ({
    baseURL,
  }) => {
    const apiClient = createTestApiClient(baseURL);
    const name = `Listable User Ingredient ${crypto.randomUUID()}`;
    const createResult = await createUserIngredient({
      client: apiClient,
      body: {
        name,
      },
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });

    expect(createResult.response?.status).toBe(201);

    const result = await listUserIngredients({
      client: apiClient,
      query: {
        page: 1,
        pageSize: 20,
      },
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });

    expect(result.response?.status).toBe(200);
    expect(result.response?.headers.get("content-type")).toContain(
      "application/json",
    );
    expect(result.data?.page).toBe(1);
    expect(result.data?.pageSize).toBe(20);
    expect(result.data?.totalItems).toBeGreaterThanOrEqual(1);
    expect(result.data?.totalPages).toBeGreaterThanOrEqual(1);
    expect(result.data?.items).toEqual(
      expect.arrayContaining([
        {
          id: createResult.data?.id,
          name,
          category: null,
          defaultUnit: null,
        },
      ]),
    );
  });

  test("users cannot see user ingredients created by other users", async ({
    baseURL,
  }) => {
    const apiClient = createTestApiClient(baseURL);
    const visibleName = `Visible User Ingredient ${crypto.randomUUID()}`;
    const hiddenName = `Hidden User Ingredient ${crypto.randomUUID()}`;
    const visibleUserIngredient = await createUserIngredient({
      client: apiClient,
      body: {
        name: visibleName,
      },
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });
    const hiddenUserIngredient = await createUserIngredient({
      client: apiClient,
      body: {
        name: hiddenName,
      },
      headers: createAuthHeaders(E2E_TEST_USERS.secondary.id),
    });

    expect(visibleUserIngredient.response?.status).toBe(201);
    expect(hiddenUserIngredient.response?.status).toBe(201);

    const result = await listUserIngredients({
      client: apiClient,
      query: {
        page: 1,
        pageSize: 20,
      },
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });
    const userIngredientIds = result.data?.items.map((item) => item.id) ?? [];

    expect(result.response?.status).toBe(200);
    expect(userIngredientIds).toContain(visibleUserIngredient.data?.id);
    expect(userIngredientIds).not.toContain(hiddenUserIngredient.data?.id);
  });

  test("authenticated user can page through their user ingredients", async ({
    baseURL,
  }) => {
    const apiClient = createTestApiClient(baseURL);
    const groupName = `! Paged User Ingredient ${crypto.randomUUID()}`;
    const createdUserIngredients = await Promise.all(
      ["03", "01", "02"].map((suffix) =>
        createUserIngredient({
          client: apiClient,
          body: {
            name: `${groupName} ${suffix}`,
          },
          headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
        }),
      ),
    );

    for (const createdUserIngredient of createdUserIngredients) {
      expect(createdUserIngredient.response?.status).toBe(201);
    }

    const firstPage = await listUserIngredients({
      client: apiClient,
      query: {
        page: 1,
        pageSize: 2,
      },
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });
    const secondPage = await listUserIngredients({
      client: apiClient,
      query: {
        page: 2,
        pageSize: 2,
      },
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });
    const firstPageIds = firstPage.data?.items.map((item) => item.id) ?? [];
    const secondPageIds = secondPage.data?.items.map((item) => item.id) ?? [];

    expect(firstPage.response?.status).toBe(200);
    expect(firstPage.data?.page).toBe(1);
    expect(firstPage.data?.pageSize).toBe(2);
    expect(firstPage.data?.items).toHaveLength(2);
    expect(firstPage.data?.totalItems).toBeGreaterThanOrEqual(3);
    expect(firstPage.data?.totalPages).toBeGreaterThanOrEqual(2);

    expect(secondPage.response?.status).toBe(200);
    expect(secondPage.data?.page).toBe(2);
    expect(secondPage.data?.pageSize).toBe(2);
    expect(secondPage.data?.items.length).toBeLessThanOrEqual(2);
    for (const userIngredientId of secondPageIds) {
      expect(firstPageIds).not.toContain(userIngredientId);
    }
  });

  test("authenticated user can fuzzy search their user ingredients", async ({
    baseURL,
  }) => {
    const apiClient = createTestApiClient(baseURL);
    const matchingName = `Family Spice Blend ${crypto.randomUUID()}`;
    const nonMatchingName = `Blueberry Pancake Mix ${crypto.randomUUID()}`;
    const matchingUserIngredient = await createUserIngredient({
      client: apiClient,
      body: {
        name: matchingName,
      },
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });
    const nonMatchingUserIngredient = await createUserIngredient({
      client: apiClient,
      body: {
        name: nonMatchingName,
      },
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });

    expect(matchingUserIngredient.response?.status).toBe(201);
    expect(nonMatchingUserIngredient.response?.status).toBe(201);

    const result = await listUserIngredients({
      client: apiClient,
      query: {
        searchTerm: "famly spice blen",
        page: 1,
        pageSize: 20,
      },
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });

    expect(result.response?.status).toBe(200);
    expect(result.data?.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: matchingUserIngredient.data?.id,
          name: matchingName,
        }),
      ]),
    );
    expect(result.data?.items.map((item) => item.id)).not.toContain(
      nonMatchingUserIngredient.data?.id,
    );
    expect(result.data?.totalItems).toBeGreaterThanOrEqual(1);
  });

  test("rejects invalid query parameters", async ({ baseURL }) => {
    const result = await listUserIngredients({
      client: createTestApiClient(baseURL),
      query: {
        page: 0,
        pageSize: 101,
      },
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
    });

    expect(result.response?.status).toBe(400);
    expect(result.response?.headers.get("content-type")).toContain(
      "application/json",
    );
    expect(result.error).toEqual({
      message: "Invalid query parameters.",
      issues: [
        "page: Too small: expected number to be >0",
        "pageSize: Too big: expected number to be <=100",
      ],
    });
  });

  test("unauthenticated requests receive 401 unauthorized", async ({
    baseURL,
  }) => {
    const result = await listUserIngredients({
      client: createTestApiClient(baseURL),
      query: {
        page: 1,
        pageSize: 20,
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
