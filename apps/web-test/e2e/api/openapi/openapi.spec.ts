import { expect, test } from "@playwright/test";
import { createTestApiClient } from "../../api-client";

type OpenApiDocument = {
  openapi?: string;
  info?: {
    title?: string;
  };
  paths?: Record<string, unknown>;
};

type OpenApiResponses = {
  200: OpenApiDocument;
};

test.describe("GET /api/openapi.json", () => {
  test("returns the OpenAPI document", async ({ baseURL }) => {
    const result = await createTestApiClient(baseURL).get<OpenApiResponses>({
      url: "/api/openapi.json",
    });

    expect(result.response?.status).toBe(200);
    expect(result.response?.headers.get("content-type")).toContain(
      "application/json",
    );

    expect(result.data?.openapi).toBe("3.1.0");
    expect(result.data?.info?.title).toBe("MealOS Web API");
    expect(result.data?.paths?.["/api/health-check"]).toBeDefined();
    expect(result.data?.paths?.["/api/recipes"]).toBeDefined();
    expect(result.data?.paths?.["/api/units"]).toBeDefined();
  });
});
