import { headers } from "next/headers";
import type { AuthProvider, AuthenticatedUser } from "./auth-provider";
import { MOCK_AUTH_USER_ID_HEADER } from "./mock-auth.constants";

export class MockAuthProvider implements AuthProvider {
  public async getCurrentUser(): Promise<AuthenticatedUser | null> {
    const requestHeaders = await headers();
    const userId = requestHeaders.get(MOCK_AUTH_USER_ID_HEADER)?.trim();

    if (!userId) {
      return null;
    }

    return { id: userId };
  }
}
