import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { IngredientResult } from "./ingredient-result";
import type { IngredientCardIngredient } from "./ingredient-card";

export type IngredientsListIngredient = IngredientCardIngredient & {
  id: string;
};

type IngredientsListProps<TIngredient extends IngredientsListIngredient> = {
  title: string;
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
  emptyTitle: string;
  emptyDescription: string;
  onAddIngredient: (ingredient: TIngredient) => void;
};

export function IngredientsList<TIngredient extends IngredientsListIngredient>({
  title,
  ingredients,
  isLoading,
  error,
  emptyTitle,
  emptyDescription,
  onAddIngredient,
}: IngredientsListProps<TIngredient>) {
  return (
    <View className="gap-3">
      <Text className="text-sm font-semibold text-foreground">{title}</Text>

      {isLoading ? (
        <Card className="items-center gap-2 rounded-xl border border-border bg-card p-5">
          <Text className="text-sm font-semibold text-foreground">
            Loading ingredients
          </Text>
        </Card>
      ) : error ? (
        <Card className="items-center gap-2 rounded-xl border border-border bg-card p-5">
          <Text className="text-sm font-semibold text-foreground">{error}</Text>
        </Card>
      ) : ingredients.length > 0 ? (
        <View className="gap-2">
          {ingredients.map((ingredient) => (
            <IngredientResult
              key={ingredient.id}
              ingredient={ingredient}
              onAdd={() => onAddIngredient(ingredient)}
            />
          ))}
        </View>
      ) : (
        <Card className="items-center gap-2 rounded-xl border border-border bg-card p-5">
          <Text className="text-sm font-semibold text-foreground">
            {emptyTitle}
          </Text>
          <Text className="text-center text-xs text-muted-foreground">
            {emptyDescription}
          </Text>
        </Card>
      )}
    </View>
  );
}
