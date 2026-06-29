import type { ListUserIngredientResponse } from "@repo/web-api-client";
import { IngredientsList } from "./ingredients-list";

type UserIngredientsListProps = {
  ingredients: ListUserIngredientResponse[];
  isLoading: boolean;
  error: string | null;
  onAddIngredient: (ingredient: ListUserIngredientResponse) => void;
};

export function UserIngredientsList({
  ingredients,
  isLoading,
  error,
  onAddIngredient,
}: UserIngredientsListProps) {
  return (
    <IngredientsList
      title="My Ingredients"
      ingredients={ingredients}
      isLoading={isLoading}
      error={error}
      emptyTitle="No custom ingredients found"
      emptyDescription="Create a custom ingredient to add it to your recipe."
      onAddIngredient={onAddIngredient}
    />
  );
}
