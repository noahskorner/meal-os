import { useAuth } from "@/features/auth/auth-provider";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";

export function SplashScreenController() {
  const { isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading) {
      void SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return null;
}
