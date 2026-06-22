import { expect, test } from "@playwright/test";
import { MOCK_AUTH_USER_ID_HEADER } from "../../../../../web/src/app/features/auth/mock-auth.constants";
import { E2E_TEST_USERS } from "../../../test-users";

test.describe("POST /api/recipes", () => {
  test("authenticated user can create a recipe", async ({ request }) => {
    const response = await request.post("/api/recipes", {
      data: {
        name: "Weeknight Pasta",
        description: "Simple pasta with garlic and olive oil.",
        prepTimeMinutes: 10,
        cookTimeMinutes: 15,
        servings: 4,
      },
      headers: {
        [MOCK_AUTH_USER_ID_HEADER]: E2E_TEST_USERS.primary.id,
      },
    });

    expect(response.status()).toBe(201);
    expect(response.headers()["content-type"]).toContain("application/json");

    const body = await response.json();
    const location = response.headers()["location"];

    expect(body.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(body.location).toBe(`/api/recipes/${body.id}`);
    expect(location).toBe(body.location);
  });

  test("unauthenticated requests receive 401 unauthorized", async ({
    request,
  }) => {
    const response = await request.post("/api/recipes", {
      data: {
        name: "Weeknight Pasta",
      },
    });

    expect(response.status()).toBe(401);
    expect(response.headers()["content-type"]).toContain("application/json");
    await expect(response.json()).resolves.toEqual({
      message: "Authentication required.",
    });
  });

  test("successful creation returns 201 and a resource location pointer", async ({
    request,
  }) => {
    const response = await request.post("/api/recipes", {
      data: {
        name: "Tomato Soup",
      },
      headers: {
        [MOCK_AUTH_USER_ID_HEADER]: E2E_TEST_USERS.secondary.id,
      },
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    const location = response.headers()["location"];

    expect(location).toBeTruthy();
    expect(location).toBe(`/api/recipes/${body.id}`);
    expect(body.location).toBe(location);
  });
});
