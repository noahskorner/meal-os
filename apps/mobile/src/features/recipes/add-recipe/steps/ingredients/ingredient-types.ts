export type Ingredient = {
  id: string;
  name: string;
  category: string;
  defaultAmount: string;
};

export type RecipeIngredient = Ingredient & {
  sortOrder: number;
};
