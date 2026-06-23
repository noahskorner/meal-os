import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

interface NewManualRecipeFooterProps {
  primaryLabel: string;
  onPrimaryPress?: () => void;
  secondaryLabel: string;
  onSecondaryPress?: () => void;
}

export function NewManualRecipeFooter({
  primaryLabel,
  onPrimaryPress,
  secondaryLabel,
  onSecondaryPress,
}: NewManualRecipeFooterProps) {
  return (
    <View className="mt-auto gap-3 px-5 py-4">
      <Button variant="brand" onPress={onPrimaryPress}>
        <Text className="font-semibold text-primary-foreground">
          {primaryLabel}
        </Text>
      </Button>

      <Button
        variant="outline"
        onPress={onSecondaryPress}
        className="items-center py-2"
      >
        <Text className="font-medium text-brand text-sm">
          {secondaryLabel}
        </Text>
      </Button>
    </View>
  );
}
