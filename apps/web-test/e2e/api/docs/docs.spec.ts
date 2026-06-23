import { expect, test } from "@playwright/test";
import { createTestApiClient } from "../../api-client";

test.describe("GET /api/docs", () => {
  test("returns the API docs HTML", async ({ baseURL }) => {
    const result = await createTestApiClient(baseURL).get<string>({
      url: "/api/docs",
      parseAs: "text",
    });

    expect(result.response?.status).toBe(200);
    expect(result.response?.headers.get("content-type")).toContain("text/html");

    expect(result.data).toContain("MealOS API Docs");
    expect(result.data).toContain("/api/openapi.json");
  });
});
