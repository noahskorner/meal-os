import { expect, test } from "@playwright/test";
import { listIngredients } from "@repo/web-api-client";
import { createTestApiClient } from "../../../api-client";

test.describe("GET /api/ingredients", () => {
  test("returns a public paginated list of ingredients", async ({
    baseURL,
  }) => {
    const result = await listIngredients({
      client: createTestApiClient(baseURL),
      query: {
        page: 1,
        pageSize: 100,
      },
    });

    expect(result.response?.status).toBe(200);
    expect(result.response?.headers.get("content-type")).toContain(
      "application/json",
    );

    expect(result.data).toBeDefined();
    const bellPepper = result.data?.items.find(
      (ingredient) => ingredient.name === "Bell Pepper",
    );

    expect(result.data?.page).toBe(1);
    expect(result.data?.pageSize).toBe(100);
    expect(result.data?.totalItems).toBeGreaterThan(100);
    expect(result.data?.totalPages).toBeGreaterThan(1);
    expect(result.data?.items).toHaveLength(100);
    expect(bellPepper).toEqual({
      id: expect.any(String),
      name: "Bell Pepper",
      aliases: ["Bell Peppers", "Capsicum", "Sweet Pepper", "Sweet Peppers"],
      category: {
        id: expect.any(String),
        name: "Produce",
      },
      defaultUnit: {
        id: expect.any(String),
        name: "each",
        abbreviation: "ea",
        type: "COUNT",
      },
    });
  });

  test("rejects invalid query parameters", async ({ baseURL }) => {
    const result = await listIngredients({
      client: createTestApiClient(baseURL),
      query: {
        page: 0,
        pageSize: 101,
      },
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

  test("fuzzy searches ingredient names and aliases", async ({ baseURL }) => {
    const apiClient = createTestApiClient(baseURL);
    const misspelledNameResult = await listIngredients({
      client: apiClient,
      query: {
        searchTerm: "bell peper",
      },
    });
    const aliasResult = await listIngredients({
      client: apiClient,
      query: {
        searchTerm: "capsicum",
      },
    });

    expect(misspelledNameResult.response?.status).toBe(200);
    const misspelledNameMatch = misspelledNameResult.data?.items[0];

    expect(misspelledNameMatch).toBeDefined();
    expect(misspelledNameMatch?.name).toBe("Bell Pepper");
    expect(misspelledNameResult.data?.totalItems).toBeGreaterThan(0);

    expect(aliasResult.response?.status).toBe(200);
    const aliasMatch = aliasResult.data?.items[0];

    expect(aliasMatch).toBeDefined();
    expect(aliasMatch?.name).toBe("Bell Pepper");
    expect(aliasResult.data?.totalItems).toBe(1);
  });
});
