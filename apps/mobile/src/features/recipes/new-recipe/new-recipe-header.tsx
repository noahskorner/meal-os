import { Header } from "@/components/header";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { ChevronLeft } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";

export function NewRecipeHeader({
  showCancel,
  onBack,
  onCancel,
}: {
  showCancel: boolean;
  onBack: () => void;
  onCancel: () => void;
}) {
  const { colorScheme } = useColorScheme();
  const palette = colorScheme === "dark" ? THEME.dark : THEME.light;

  return (
    <Header
      left={
        <Pressable
          className="h-10 w-10 items-center justify-center text-foreground"
          onPress={onBack}
        >
          <ChevronLeft color={palette.foreground} size={22} />
        </Pressable>
      }
      right={
        showCancel ? (
          <Pressable
            className="h-10 min-w-10 items-center justify-center"
            onPress={onCancel}
          >
            <Text className="text-sm font-semibold text-brand">Cancel</Text>
          </Pressable>
        ) : (
          <View className="h-10 w-10" />
        )
      }
      title="Add Recipe"
    />
  );
}
