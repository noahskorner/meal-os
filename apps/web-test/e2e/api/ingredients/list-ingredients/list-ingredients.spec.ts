import { expect, test } from "@playwright/test";

test.describe("GET /api/ingredients", () => {
  test("returns a public paginated list of ingredients", async ({
    request,
  }) => {
    const response = await request.get("/api/ingredients?page=1&pageSize=100");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");

    const body = await response.json();
    const bellPepper = body.items.find(
      (ingredient: { name: string }) => ingredient.name === "Bell Pepper",
    );

    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(100);
    expect(body.totalItems).toBeGreaterThan(100);
    expect(body.totalPages).toBeGreaterThan(1);
    expect(body.items).toHaveLength(100);
    expect(bellPepper).toEqual({
      id: expect.any(String),
      name: "Bell Pepper",
      aliases: [
        "Bell Peppers",
        "Capsicum",
        "Sweet Pepper",
        "Sweet Peppers",
      ],
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

  test("rejects invalid query parameters", async ({ request }) => {
    const response = await request.get("/api/ingredients?page=0&pageSize=101");

    expect(response.status()).toBe(400);
    expect(response.headers()["content-type"]).toContain("application/json");
    await expect(response.json()).resolves.toEqual({
      message: "Invalid query parameters.",
      issues: [
        "page: Too small: expected number to be >0",
        "pageSize: Too big: expected number to be <=100",
      ],
    });
  });
});
