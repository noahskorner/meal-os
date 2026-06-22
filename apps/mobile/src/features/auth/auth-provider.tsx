import { supabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";
import * as React from "react";
import { AppState, Platform } from "react-native";

type AuthActionResult = {
  errorMessage: string | null;
  requiresEmailConfirmation?: boolean;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signInWithPassword: (
    email: string,
    password: string,
  ) => Promise<AuthActionResult>;
  signUpWithPassword: (
    email: string,
    password: string,
  ) => Promise<AuthActionResult>;
  signOut: () => Promise<AuthActionResult>;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      const {
        data: { session: nextSession },
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      setSession(nextSession);

      if (isMounted) {
        setIsLoading(false);
      }
    }

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, nextSession) => {
      setSession(nextSession);
      setIsLoading(false);
    });

    const appStateSubscription =
      Platform.OS === "web"
        ? null
        : AppState.addEventListener("change", (nextAppState) => {
            if (nextAppState === "active") {
              void supabase.auth.startAutoRefresh();
            } else {
              void supabase.auth.stopAutoRefresh();
            }
          });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      appStateSubscription?.remove();
    };
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isLoading,
      async signInWithPassword(email, password) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        return {
          errorMessage: error?.message ?? null,
        };
      },
      async signUpWithPassword(email, password) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        return {
          errorMessage: error?.message ?? null,
          requiresEmailConfirmation: Boolean(data.user && !data.session),
        };
      },
      async signOut() {
        const { error } = await supabase.auth.signOut();

        return {
          errorMessage: error?.message ?? null,
        };
      },
    }),
    [isLoading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = React.useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return value;
}
