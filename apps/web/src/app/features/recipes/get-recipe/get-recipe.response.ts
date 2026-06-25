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
  ingredientId: string | null;
  userIngredientId: string | null;
  name: string;
  quantity: number | null;
  unitId: string | null;
  preparation: string | null;
  note: string | null;
  isOptional: boolean | null;
  ingredient: GetRecipeIngredientReferenceResponse | null;
  userIngredient: GetRecipeUserIngredientReferenceResponse | null;
};

export type GetRecipeStepResponse = {
  id: string;
  text: string;
  sortOrder: number;
};

export type GetRecipeIngredientReferenceResponse = {
  id: string;
  name: string;
};

export type GetRecipeUserIngredientReferenceResponse = {
  id: string;
  name: string;
};
