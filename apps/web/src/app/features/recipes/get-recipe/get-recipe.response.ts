export type GetRecipeResponse = {
  id: string;
  name: string;
  description: string | null;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  servings: number | null;
  ingredients: GetRecipeIngredientResponse[];
  steps: GetRecipeStepResponse[];
};

export type GetRecipeIngredientResponse = {
  id: string;
  ingredientId: string;
  name: string;
  quantity: number | null;
  unitId: string | null;
  preparation: string | null;
  note: string | null;
  isOptional: boolean | null;
};

export type GetRecipeStepResponse = {
  id: string;
  ingredientId: string | null;
  text: string;
  sortOrder: number;
};
