import { useAuth } from "@/features/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Alert, View } from "react-native";

export function HomeScreen() {
  const { signOut, user } = useAuth();

  return (
    <View className="flex-1 justify-center bg-background px-6 py-10">
      <View className="gap-4">
        <Text className="text-muted-foreground">
          Signed in as{" "}
          <Text className="text-brand">{user?.email ?? "unknown user"}</Text>.
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
    </View>
  );
}
