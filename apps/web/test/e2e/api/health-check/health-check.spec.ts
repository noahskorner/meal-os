import { expect, test } from "@playwright/test";

test("GET /api/health-check returns the service status", async ({
  request,
}) => {
  const response = await request.get("/api/health-check");

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/json");
  await expect(response).toBeOK();
  expect(await response.json()).toMatchObject({
    service: "web",
    status: "ok",
  });
});
