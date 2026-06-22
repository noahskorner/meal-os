import { expect, test } from "@playwright/test";
import { MOCK_AUTH_USER_ID_HEADER } from "../../../../../web/src/app/features/auth/mock-auth.constants";
import { E2E_TEST_USERS } from "../../../test-users";

test.describe("GET /api/profiles/:id", () => {
  test("authenticated user can retrieve their own profile", async ({
    request,
  }) => {
    const response = await request.get(
      `/api/profiles/${E2E_TEST_USERS.primary.id}`,
      {
        headers: {
          [MOCK_AUTH_USER_ID_HEADER]: E2E_TEST_USERS.primary.id,
        },
      },
    );

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");
    await expect(response.json()).resolves.toEqual({
      id: E2E_TEST_USERS.primary.id,
    });
  });

  test("authenticated user cannot retrieve another user's profile", async ({
    request,
  }) => {
    const response = await request.get(
      `/api/profiles/${E2E_TEST_USERS.secondary.id}`,
      {
        headers: {
          [MOCK_AUTH_USER_ID_HEADER]: E2E_TEST_USERS.primary.id,
        },
      },
    );

    expect(response.status()).toBe(403);
    expect(response.headers()["content-type"]).toContain("application/json");
    await expect(response.json()).resolves.toEqual({
      message: "You can only access your own profile.",
    });
  });

  test("rejects unauthenticated requests", async ({ request }) => {
    const response = await request.get(
      `/api/profiles/${E2E_TEST_USERS.primary.id}`,
    );

    expect(response.status()).toBe(401);
    expect(response.headers()["content-type"]).toContain("application/json");
    await expect(response.json()).resolves.toEqual({
      message: "Authentication required.",
    });
  });
});
