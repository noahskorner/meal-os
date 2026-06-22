import { expect, test } from "@playwright/test";

test.describe("GET /api/openapi.json", () => {
  test("returns the OpenAPI document", async ({ request }) => {
    const response = await request.get("/api/openapi.json");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");

    const body = await response.json();

    expect(body.openapi).toBe("3.1.0");
    expect(body.info?.title).toBe("Theta Web API");
    expect(body.paths?.["/api/health-check"]).toBeDefined();
  });
});
