import { useAuth } from "@/features/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";

export function HomeScreen() {
  const { profile, signOut, user } = useAuth();

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text variant="h1" style={styles.title}>
          Authenticated
        </Text>
        <Text style={styles.body}>Signed in as {user?.email ?? "unknown user"}.</Text>

        {profile ? (
          <Text style={styles.body}>Profile row ready for user ID {profile.id}.</Text>
        ) : (
          <View style={styles.profilePending}>
            <ActivityIndicator />
            <Text style={styles.body}>Waiting for the profile row to resolve.</Text>
          </View>
        )}

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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f4f4ef",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    padding: 24,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d6d0c4",
    gap: 16,
  },
  title: {
    textAlign: "left",
    fontSize: 32,
  },
  body: {
    color: "#3f3f46",
  },
  profilePending: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
