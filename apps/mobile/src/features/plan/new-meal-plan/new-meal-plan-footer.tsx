import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { View } from "react-native";

type NewMealPlanFooterProps = {
  primaryLabel: string;
  onPrimaryPress?: () => void;
};

export function NewMealPlanFooter({
  primaryLabel,
  onPrimaryPress,
}: NewMealPlanFooterProps) {
  return (
    <View className="mt-auto gap-3 px-5 py-4">
      <Button variant="brand" onPress={onPrimaryPress}>
        <Text className="font-semibold text-primary-foreground">{primaryLabel}</Text>
      </Button>
    </View>
  );
}
