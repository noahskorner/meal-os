export type AuthenticatedUser = {
  id: string;
};

export interface AuthProvider {
  getCurrentUser(): Promise<AuthenticatedUser | null>;
}
