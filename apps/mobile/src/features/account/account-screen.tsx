import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/features/auth/auth-provider";
import { TabPlaceholderScreen } from "@/components/tab-placeholder-screen";
import { useColorScheme } from "nativewind";
import { Alert, Switch, View } from "react-native";

export function AccountScreen() {
  const { signOut, user } = useAuth();
  const { colorScheme, setColorScheme } = useColorScheme();

  return (
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
  );
}
