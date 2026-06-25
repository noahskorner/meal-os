import { BottomSheet, BottomSheetContent } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/features/auth/auth-provider";
import { TabPlaceholderScreen } from "@/components/tab-placeholder-screen";
import * as React from "react";
import { useColorScheme } from "nativewind";
import { Alert, Switch, View } from "react-native";

const bottomSheetSnapPoints = ["40%"];

export function AccountScreen() {
  const { signOut, user } = useAuth();
  const { colorScheme, setColorScheme } = useColorScheme();
  const bottomSheetRef = React.useRef<React.ElementRef<typeof BottomSheet>>(null);

  return (
    <>
      <TabPlaceholderScreen
        eyebrow="Account"
        title="Account placeholder"
        description="Account settings, profile details, and preferences can live here once the feature is built."
        footer={
          <View className="gap-4">
            <Text className="text-sm text-muted-foreground">
              Signed in as{" "}
              <Text className="font-medium text-brand">
                {user?.email ?? "unknown user"}
              </Text>
              .
            </Text>
            <View className="flex-row items-center justify-between">
              <Text>Dark mode</Text>
              <Switch
                value={colorScheme === "dark"}
                onValueChange={(enabled) =>
                  setColorScheme(enabled ? "dark" : "light")
                }
              />
            </View>
            <Button
              onPress={() => {
                bottomSheetRef.current?.present();
              }}
              variant="brand-outline"
            >
              <Text>Open bottom sheet demo</Text>
            </Button>
            <Button
              onPress={async () => {
                const result = await signOut();

                if (result.errorMessage) {
                  Alert.alert("Sign out failed", result.errorMessage);
                }
              }}
              variant="outline"
            >
              <Text>Sign out</Text>
            </Button>
          </View>
        }
      />

      <BottomSheet ref={bottomSheetRef} index={0} snapPoints={bottomSheetSnapPoints}>
        <BottomSheetContent>
          <View className="gap-2">
            <Text className="text-lg font-semibold text-foreground">
              Bottom sheet demo
            </Text>
            <Text className="text-sm leading-6 text-muted-foreground">
              Placeholder content for the shared mobile bottom sheet. Use this to
              confirm presentation, gestures, and styling on iOS and Android.
            </Text>
          </View>

          <Button
            onPress={() => {
              bottomSheetRef.current?.dismiss();
            }}
          >
            <Text>Close</Text>
          </Button>
        </BottomSheetContent>
      </BottomSheet>
    </>
  );
}
