import { expect, test } from "@playwright/test";
import { healthCheck } from "@repo/web-api-client";
import { createTestApiClient } from "../../api-client";

test.describe("GET /api/health-check", () => {
  test("returns the default health-check payload", async ({ baseURL }) => {
    const result = await healthCheck({
      client: createTestApiClient(baseURL),
    });

    expect(result.response?.status).toBe(200);
    expect(result.response?.headers.get("content-type")).toContain(
      "application/json",
    );
    expect(result.data).toEqual({
      status: "ok",
      service: "web",
    });
  });

  test("returns a timestamp when requested", async ({ baseURL }) => {
    const result = await healthCheck({
      client: createTestApiClient(baseURL),
      query: {
        includeTimestamp: "true",
      },
    });

    expect(result.response?.status).toBe(200);
    expect(result.response?.headers.get("content-type")).toContain(
      "application/json",
    );

    expect(result.data).toBeDefined();
    expect(result.data?.status).toBe("ok");
    expect(result.data?.service).toBe("web");
    expect(result.data?.timestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/,
    );
  });
});
