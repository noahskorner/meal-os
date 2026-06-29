import { Text } from "@/components/ui/text";
import { View } from "react-native";

export function MealPlanStepTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View>
      <Text className="text-2xl font-bold text-foreground">{title}</Text>
      <Text className="mt-1 text-sm text-muted-foreground">{subtitle}</Text>
    </View>
  );
}
