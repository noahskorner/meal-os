import { expect, test } from "@playwright/test";

test.describe("GET /api/health-check", () => {
  test("returns the default health-check payload", async ({ request }) => {
    const response = await request.get("/api/health-check");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");
    await expect(response.json()).resolves.toEqual({
      status: "ok",
      service: "web",
    });
  });

  test("returns a timestamp when requested", async ({ request }) => {
    const response = await request.get(
      "/api/health-check?includeTimestamp=true",
    );

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");

    const body = await response.json();

    expect(body.status).toBe("ok");
    expect(body.service).toBe("web");
    expect(body.timestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/,
    );
  });
});
