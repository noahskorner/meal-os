import { expect, test } from "@playwright/test";
import { getProfile } from "@repo/web-api-client";
import { createAuthHeaders, createTestApiClient } from "../../../api-client";
import { E2E_TEST_USERS } from "../../../test-users";

test.describe("GET /api/profiles/:id", () => {
  test("authenticated user can retrieve their own profile", async ({
    baseURL,
  }) => {
    const result = await getProfile({
      client: createTestApiClient(baseURL),
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
      path: {
        id: E2E_TEST_USERS.primary.id,
      },
    });

    expect(result.response?.status).toBe(200);
    expect(result.response?.headers.get("content-type")).toContain(
      "application/json",
    );
    expect(result.data).toEqual({
      id: E2E_TEST_USERS.primary.id,
    });
  });

  test("authenticated user cannot retrieve another user's profile", async ({
    baseURL,
  }) => {
    const result = await getProfile({
      client: createTestApiClient(baseURL),
      headers: createAuthHeaders(E2E_TEST_USERS.primary.id),
      path: {
        id: E2E_TEST_USERS.secondary.id,
      },
    });

    expect(result.response?.status).toBe(403);
    expect(result.response?.headers.get("content-type")).toContain(
      "application/json",
    );
    expect(result.error).toEqual({
      message: "You can only access your own profile.",
    });
  });

  test("rejects unauthenticated requests", async ({ baseURL }) => {
    const result = await getProfile({
      client: createTestApiClient(baseURL),
      path: {
        id: E2E_TEST_USERS.primary.id,
      },
    });

    expect(result.response?.status).toBe(401);
    expect(result.response?.headers.get("content-type")).toContain(
      "application/json",
    );
    expect(result.error).toEqual({
      message: "Authentication required.",
    });
  });
});
