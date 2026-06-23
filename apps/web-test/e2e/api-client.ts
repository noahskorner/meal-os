import { createClient, type Client, type Config } from "@repo/web-api-client";
import { MOCK_AUTH_USER_ID_HEADER } from "../../web/src/app/features/auth/mock-auth.constants";

export function createTestApiClient(
  baseURL: string | undefined,
  config: Omit<Config, "baseUrl"> = {},
): Client {
  return createClient({
    baseUrl: baseURL ?? "http://127.0.0.1:3000",
    ...config,
  });
}

export function createAuthHeaders(userId: string): Record<string, string> {
  return {
    [MOCK_AUTH_USER_ID_HEADER]: userId,
  };
}
