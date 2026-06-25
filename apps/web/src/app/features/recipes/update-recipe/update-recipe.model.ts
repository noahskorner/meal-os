export type UpdateRecipeModel = {
  id: string;
  name: string;
  description: string | null;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  servings: number | null;
  recipeIngredients: UpdateRecipeIngredientModel[];
  recipeSteps: UpdateRecipeStepModel[];
};

export type UpdateRecipeIngredientModel = {
  ingredientId: string;
  name: string;
  quantity: number | null;
  unitId: string | null;
  preparation: string | null;
  note: string | null;
  isOptional: boolean | null;
};

export type UpdateRecipeStepModel = {
  ingredientId: string | null;
  text: string;
  sortOrder: number;
};
