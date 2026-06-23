import { expect, test } from "@playwright/test";
import type { ListUnitsResponse } from "@repo/web-api-client";

test.describe("GET /api/units", () => {
  test("returns all units", async ({ request }) => {
    const response = await request.get("/api/units");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");

    const body = (await response.json()) as ListUnitsResponse;

    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(47);
    expect(body[0]).toEqual({
      id: expect.any(String),
      name: "bag",
      abbreviation: "bag",
      type: "PACKAGE",
    });
    expect(body).toContainEqual({
      id: expect.any(String),
      name: "cup",
      abbreviation: "cup",
      type: "VOLUME",
    });
    expect(body).toContainEqual({
      id: expect.any(String),
      name: "each",
      abbreviation: "ea",
      type: "COUNT",
    });
  });
});
