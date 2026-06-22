import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { AuthProvider, AuthenticatedUser } from "./auth-provider";

function getSupabaseConfiguration() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Supabase auth requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY).",
    );
  }

  return { url, publishableKey };
}

export class SupabaseAuthProvider implements AuthProvider {
  public async getCurrentUser(): Promise<AuthenticatedUser | null> {
    const cookieStore = await cookies();
    const { url, publishableKey } = getSupabaseConfiguration();
    const supabase = createServerClient(url, publishableKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Route handlers can ignore cookie refresh failures for one-off auth checks.
          }
        },
      },
    });
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return null;
    }

    return {
      id: data.user.id,
    };
  }
}
