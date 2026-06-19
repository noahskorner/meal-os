import "../global.css";

import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "#09090b",
          },
          headerTintColor: "#fafafa",
          contentStyle: {
            backgroundColor: "#09090b",
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
