import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

interface NewManualRecipeFooterProps {
  primaryLabel: string;
  onPrimaryPress?: () => void;
}

export function NewManualRecipeFooter({
  primaryLabel,
  onPrimaryPress,
}: NewManualRecipeFooterProps) {
  return (
    <View className="mt-auto gap-3 px-5 py-4">
      <Button variant="brand" onPress={onPrimaryPress}>
        <Text className="font-semibold text-primary-foreground">
          {primaryLabel}
        </Text>
      </Button>
    </View>
  );
}
