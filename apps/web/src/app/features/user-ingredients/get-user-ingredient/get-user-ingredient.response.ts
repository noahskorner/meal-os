export type GetUserIngredientResponse = {
  id: string;
  name: string;
  categoryId: string | null;
  defaultUnitId: string | null;
  category: GetUserIngredientCategoryResponse | null;
  defaultUnit: GetUserIngredientUnitResponse | null;
};

export type GetUserIngredientCategoryResponse = {
  id: string;
  name: string;
};

export type GetUserIngredientUnitResponse = {
  id: string;
  name: string;
  abbreviation: string;
  type: string;
};
