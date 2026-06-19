import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, View } from "react-native";

import { Button, ButtonText } from "../../components/ui/button";

export function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <StatusBar style="light" />
      <View className="flex-1 justify-between px-6 py-8">
        <View className="gap-6">
          <View className="self-start rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <Text className="text-xs font-medium uppercase tracking-[2px] text-zinc-300">
              Expo SDK 54
            </Text>
          </View>

          <View className="gap-3">
            <Text className="text-4xl font-bold tracking-tight text-white">
              Theta mobile starts simple.
            </Text>
            <Text className="max-w-sm text-base leading-6 text-zinc-400">
              Expo Router handles the file-based navigation, NativeWind drives
              the styling, and the UI layer stays local and editable.
            </Text>
          </View>

          <View className="gap-3 rounded-3xl border border-white/10 bg-white/5 p-5">
            <Text className="text-lg font-semibold text-white">
              Current slice
            </Text>
            <Text className="text-sm leading-6 text-zinc-400">
              This screen lives in `features/home`, with routes staying thin in
              `app/` and reusable UI under `components/ui`.
            </Text>
          </View>
        </View>

        <View className="gap-3">
          <Link asChild href="/settings">
            <Button>
              <ButtonText>Open settings</ButtonText>
            </Button>
          </Link>

          <Button disabled variant="outline">
            <ButtonText variant="outline">
              More features can land here
            </ButtonText>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
