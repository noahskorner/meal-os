import { Pressable, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { Text } from "@/components/ui/text";

export function AddRecipeHeader({
  showCancel,
  onBack,
  onCancel,
}: {
  showCancel: boolean;
  onBack: () => void;
  onCancel: () => void;
}) {
  return (
    <View className="h-16 flex-row items-center justify-between px-4">
      <Pressable
        className="h-10 w-10 items-center justify-center"
        onPress={onBack}
      >
        <ChevronLeft size={22} />
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
