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
  ingredientId: string | null;
  userIngredientId: string | null;
  name: string;
  quantity: number | null;
  unitId: string | null;
  preparation: string | null;
  note: string | null;
  isOptional: boolean | null;
  ingredient: GetRecipeIngredientReferenceModel | null;
  userIngredient: GetRecipeUserIngredientReferenceModel | null;
};

export type GetRecipeStepModel = {
  id: string;
  text: string;
  sortOrder: number;
};

export type GetRecipeIngredientReferenceModel = {
  id: string;
  name: string;
};

export type GetRecipeUserIngredientReferenceModel = {
  id: string;
  name: string;
};
