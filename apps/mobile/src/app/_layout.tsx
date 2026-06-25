import { ThemeProvider } from "@react-navigation/native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalHost } from "@rn-primitives/portal";
import { AuthProvider, useAuth } from "@/features/auth/auth-provider";
import { SplashScreenController } from "@/features/auth/splash-screen-controller";
import { IngredientCategoriesProvider } from "@/features/ingredients/list-categories/use-ingredient-categories";
import { UnitsProvider } from "@/features/units/use-units";
import { NAV_THEME } from "@/lib/theme";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={theme}>
        <UnitsProvider>
          <IngredientCategoriesProvider>
            <BottomSheetModalProvider>
              <AuthProvider>
                <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
                <SplashScreenController />
                <RootNavigator />
                <PortalHost />
              </AuthProvider>
            </BottomSheetModalProvider>
          </IngredientCategoriesProvider>
        </UnitsProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
