export type GetRecipeModel = {
  id: string;
  name: string;
  description: string | null;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  servings: number | null;
  ingredients: GetRecipeIngredientModel[];
  steps: GetRecipeStepModel[];
};

export type GetRecipeIngredientModel = {
  id: string;
  ingredientId: string;
  name: string;
  quantity: number | null;
  unitId: string | null;
  preparation: string | null;
  note: string | null;
  isOptional: boolean | null;
};

export type GetRecipeStepModel = {
  id: string;
  ingredientId: string | null;
  text: string;
  sortOrder: number;
};
