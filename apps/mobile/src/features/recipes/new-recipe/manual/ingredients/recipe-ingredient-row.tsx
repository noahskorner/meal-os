import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useUnits } from "@/features/units/use-units";
import type { CreateRecipeIngredientRequest } from "@repo/web-api-client";
import { Trash2 } from "lucide-react-native";
import { Pressable, View } from "react-native";

type RecipeIngredientRowProps = {
  ingredient: CreateRecipeIngredientRequest;
  onEditAmount: () => void;
  onRemove: () => void;
};

export function RecipeIngredientRow({
  ingredient,
  onEditAmount,
  onRemove,
}: RecipeIngredientRowProps) {
  const { units } = useUnits();
  const unit = units.find((item) => item.id === ingredient.unitId);
  const amountLabel = [ingredient.quantity ?? 1, unit?.abbreviation]
    .filter(Boolean)
    .join(" ");

  return (
    <Card className="flex-1 flex-row items-center gap-3 rounded-xl border border-border bg-card p-3">
      <Pressable
        className="min-h-9 min-w-16 items-center justify-center rounded-md border border-border bg-background px-3"
        onPress={onEditAmount}
        hitSlop={6}
      >
        <Text className="text-xs font-semibold text-foreground">
          {amountLabel}
        </Text>
      </Pressable>

      <View className="min-w-0 flex-1">
        <Text className="text-sm font-medium text-foreground">
          {ingredient.name}
        </Text>
        {ingredient.preparation ? (
          <Text className="text-xs text-muted-foreground">
            {ingredient.preparation}
          </Text>
        ) : null}
      </View>

      <Pressable className="p-1" onPress={onRemove} hitSlop={8}>
        <Icon as={Trash2} size={18} className="text-muted-foreground" />
      </Pressable>
    </Card>
  );
}
