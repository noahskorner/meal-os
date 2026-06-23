import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import type { ListIngredientResponse } from "@/lib/web-api-client";
import { View } from "react-native";
import { ReactNode } from "react";

type IngredientCardProps = {
  ingredient: ListIngredientResponse;
  rightAction: ReactNode;
};

export function IngredientCard({
  ingredient,
  rightAction,
}: IngredientCardProps) {
  const defaultAmount =
    ingredient.defaultUnit.abbreviation || ingredient.defaultUnit.name;

  return (
    <Card className="flex-1 flex-row items-center gap-3 rounded-xl border border-border bg-card p-3">
      <View className="h-9 w-9 items-center justify-center rounded-md border border-border bg-background">
        <Text className="text-xs font-semibold text-brand">
          {ingredient.name.slice(0, 1)}
        </Text>
      </View>

      <View className="min-w-0 flex-1">
        <Text className="text-sm font-medium text-foreground">
          {ingredient.name}
        </Text>
        <Text className="text-xs text-muted-foreground">
          {ingredient.category.name} - {defaultAmount}
        </Text>
      </View>

      {rightAction}
    </Card>
  );
}
