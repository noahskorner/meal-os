import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { AuthProvider, useAuth } from "@/features/auth/auth-provider";
import { SplashScreenController } from "@/features/auth/splash-screen-controller";
import { NAV_THEME } from "@/lib/theme";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import "./global.css";

void SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { session } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={Boolean(session)}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider value={NAV_THEME["light"]}>
      <AuthProvider>
        <SplashScreenController />
        <RootNavigator />
        <PortalHost />
      </AuthProvider>
    </ThemeProvider>
  );
}
