import { Text } from "@/components/ui/text";
import { View } from "react-native";

export function MealPlanPlaceholderCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View className="rounded-2xl border border-border bg-card px-4 py-4">
      <Text className="text-base font-semibold text-foreground">{title}</Text>
      <Text className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </Text>
    </View>
  );
}
