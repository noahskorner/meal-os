import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import type { CreateRecipeIngredientRequest } from "@repo/web-api-client";
import { Trash2 } from "lucide-react-native";
import { Pressable, View } from "react-native";

type RecipeIngredientRowProps = {
  ingredient: CreateRecipeIngredientRequest;
  onRemove: () => void;
};

export function RecipeIngredientRow({
  ingredient,
  onRemove,
}: RecipeIngredientRowProps) {
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
