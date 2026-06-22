import { expect, test } from "@playwright/test";

test("GET /api/openapi.json returns the OpenAPI document", async ({
  request,
}) => {
  const response = await request.get("/api/openapi.json");

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/json");

  const body = await response.json();

  expect(body).toMatchObject({
    info: {
      title: "Theta Web API",
      version: "1.0.0",
    },
    openapi: "3.1.0",
  });
  expect(body.paths["/api/health-check"]).toBeDefined();
});
