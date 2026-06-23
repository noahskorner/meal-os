import { expect, test } from "@playwright/test";
import { listUnits } from "@repo/web-api-client";
import { createTestApiClient } from "../../../api-client";

test.describe("GET /api/units", () => {
  test("returns all units", async ({ baseURL }) => {
    const result = await listUnits({
      client: createTestApiClient(baseURL),
    });

    expect(result.response?.status).toBe(200);
    expect(result.response?.headers.get("content-type")).toContain(
      "application/json",
    );

    expect(result.data).toBeDefined();
    expect(result.data).toHaveLength(47);
    expect(result.data?.[0]).toEqual({
      id: expect.any(String),
      name: "bag",
      abbreviation: "bag",
      type: "PACKAGE",
    });
    expect(result.data).toContainEqual({
      id: expect.any(String),
      name: "cup",
      abbreviation: "cup",
      type: "VOLUME",
    });
    expect(result.data).toContainEqual({
      id: expect.any(String),
      name: "each",
      abbreviation: "ea",
      type: "COUNT",
    });
  });
});
