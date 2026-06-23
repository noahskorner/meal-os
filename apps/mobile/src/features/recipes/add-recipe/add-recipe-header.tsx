import { Pressable, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";

export function AddRecipeHeader({
  showCancel,
  onBack,
  onCancel,
}: {
  showCancel: boolean;
  onBack: () => void;
  onCancel: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const palette = colorScheme === "dark" ? THEME.dark : THEME.light;

  return (
    <View
      className="flex-row items-center justify-between px-4"
      style={{
        paddingTop: insets.top,
        height: 64 + insets.top,
      }}
    >
      <Pressable
        className="h-10 w-10 items-center justify-center text-foreground"
        onPress={onBack}
      >
        <ChevronLeft color={palette.foreground} size={22} />
      </Pressable>

      <Text className="text-base font-semibold text-foreground">
        Add Recipe
      </Text>

      <Pressable
        className="h-10 min-w-10 items-center justify-center"
        onPress={onCancel}
      >
        {showCancel ? (
          <Text className="text-sm font-semibold text-brand">Cancel</Text>
        ) : (
          <View className="w-10" />
        )}
      </Pressable>
    </View>
  );
}
