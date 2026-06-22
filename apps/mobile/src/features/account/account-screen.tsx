import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/features/auth/auth-provider";
import { TabPlaceholderScreen } from "@/components/tab-placeholder-screen";
import { Alert, View } from "react-native";

export function AccountScreen() {
  const { signOut, user } = useAuth();

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
