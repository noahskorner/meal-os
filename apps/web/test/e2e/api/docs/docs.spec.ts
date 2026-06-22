import { expect, test } from "@playwright/test";

test("GET /api/docs returns the API docs page", async ({ request }) => {
  const response = await request.get("/api/docs");

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/html");

  const body = await response.text();

  expect(body).toContain("Theta API Docs");
  expect(body).toContain("/api/openapi.json");
});
