export type CreateRecipeModel = {
  createdById: string;
  name: string;
  description: string | null;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  servings: number | null;
  recipeIngredients: CreateRecipeIngredientModel[];
  recipeSteps: CreateRecipeStepModel[];
};

export type CreateRecipeIngredientModel = {
  ingredientId: string;
  name: string;
  quantity: number | null;
  unitId: string | null;
  preparation: string | null;
  note: string | null;
  isOptional: boolean | null;
};

export type CreateRecipeStepModel = {
  text: string;
  sortOrder: number;
};
