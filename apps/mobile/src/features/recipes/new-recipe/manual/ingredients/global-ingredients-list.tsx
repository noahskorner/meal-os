import type { ListIngredientResponse } from "@repo/web-api-client";
import { IngredientsList } from "./ingredients-list";

type GlobalIngredientsListProps = {
  ingredients: ListIngredientResponse[];
  isLoading: boolean;
  error: string | null;
  onAddIngredient: (ingredient: ListIngredientResponse) => void;
};

export function GlobalIngredientsList({
  ingredients,
  isLoading,
  error,
  onAddIngredient,
}: GlobalIngredientsListProps) {
  return (
    <IngredientsList
      title="Search Results"
      ingredients={ingredients}
      isLoading={isLoading}
      error={error}
      emptyTitle="No ingredients found"
      emptyDescription="Create a new ingredient to add it to your recipe."
      onAddIngredient={onAddIngredient}
    />
  );
}
