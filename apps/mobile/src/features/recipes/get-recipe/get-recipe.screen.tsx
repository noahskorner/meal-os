import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function GetRecipeScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const palette = colorScheme === "dark" ? THEME.dark : THEME.light;
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();

  useEffect(() => {
    console.log("Recipe ID:", recipeId);
  }, [recipeId]);

  return (
    <View className="flex-1 bg-background">
      <View
        className="border-b border-border bg-background px-5 pb-4"
        style={{ paddingTop: insets.top + 16 }}
      >
        <View className="flex-row items-center gap-3">
          <Pressable
            accessibilityLabel="Back to recipes"
            className="h-10 w-10 items-center justify-center rounded-full border border-border bg-card"
            onPress={() => router.back()}
          >
            <ChevronLeft color={palette.foreground} size={22} />
          </Pressable>

          <Text className="text-2xl font-bold leading-8 text-foreground">
            Recipe
          </Text>
        </View>
      </View>

      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-center text-lg font-semibold text-foreground">
          Recipe details coming soon
        </Text>
        <Text className="mt-2 text-center text-sm text-muted-foreground">
          {recipeId}
        </Text>
      </View>
    </View>
  );
}
