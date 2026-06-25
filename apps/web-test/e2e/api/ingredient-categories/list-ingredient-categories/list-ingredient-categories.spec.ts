import { expect, test } from "@playwright/test";
import { listIngredientCategories } from "@repo/web-api-client";
import { createTestApiClient } from "../../../api-client";

test.describe("GET /api/ingredient-categories", () => {
  test("returns all ingredient categories", async ({ baseURL }) => {
    const result = await listIngredientCategories({
      client: createTestApiClient(baseURL),
    });

    expect(result.response?.status).toBe(200);
    expect(result.response?.headers.get("content-type")).toContain(
      "application/json",
    );

    expect(result.data).toBeDefined();
    expect(result.data).toHaveLength(11);
    expect(result.data?.[0]).toEqual({
      id: expect.any(String),
      name: "Bakery",
    });
    expect(result.data).toContainEqual({
      id: expect.any(String),
      name: "Produce",
    });
    expect(result.data).toContainEqual({
      id: expect.any(String),
      name: "Meat & Seafood",
    });
  });
});
