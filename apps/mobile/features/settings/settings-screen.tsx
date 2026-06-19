import { Link } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";

import { Button, ButtonText } from "../../components/ui/button";

export function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="flex-1 gap-6 px-6 py-8">
        <View className="gap-3">
          <Text className="text-3xl font-bold tracking-tight text-white">
            Settings
          </Text>
          <Text className="text-base leading-6 text-zinc-400">
            Keep feature-specific state and flows here as the app grows. For
            now, this is just a placeholder route proving the Router and UI
            stack.
          </Text>
        </View>

        <View className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <Text className="text-sm leading-6 text-zinc-300">
            MVP rules for this app: no backend, no auth, no database. Just a
            clean mobile shell that matches the repo’s Next.js-style ergonomics.
          </Text>
        </View>

        <View className="mt-auto">
          <Link asChild href="/">
            <Button variant="secondary">
              <ButtonText variant="secondary">Back home</ButtonText>
            </Button>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
