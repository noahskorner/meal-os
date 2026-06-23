import { Icon } from "@/components/ui/icon";
import { Trash2 } from "lucide-react-native";
import { Pressable } from "react-native";
import { IngredientCard } from "./ingredient-card";
import type { RecipeIngredient } from "./ingredient-data";

type RecipeIngredientRowProps = {
  ingredient: RecipeIngredient;
  onRemove: () => void;
};

export function RecipeIngredientRow({
  ingredient,
  onRemove,
}: RecipeIngredientRowProps) {
  return (
    <IngredientCard
      ingredient={ingredient}
      rightAction={
        <Pressable className="p-1" onPress={onRemove} hitSlop={8}>
          <Icon as={Trash2} size={18} className="text-muted-foreground" />
        </Pressable>
      }
    />
  );
}
