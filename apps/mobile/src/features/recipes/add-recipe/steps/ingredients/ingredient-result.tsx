import { Icon } from "@/components/ui/icon";
import { Plus } from "lucide-react-native";
import { Pressable } from "react-native";
import { IngredientCard } from "./ingredient-card";
import { Ingredient } from "./ingredient-types";

type IngredientResultProps = {
  ingredient: Ingredient;
  onAdd: () => void;
};

export function IngredientResult({
  ingredient,
  onAdd,
}: IngredientResultProps) {
  return (
    <IngredientCard
      ingredient={ingredient}
      rightAction={
        <Pressable
          className="h-8 w-8 items-center justify-center"
          onPress={onAdd}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Add ${ingredient.name}`}
        >
          <Icon as={Plus} size={18} className="text-brand" />
        </Pressable>
      }
    />
  );
}
