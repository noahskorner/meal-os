export type GetUserIngredientModel = {
  id: string;
  name: string;
  categoryId: string | null;
  defaultUnitId: string | null;
  category: GetUserIngredientCategoryModel | null;
  defaultUnit: GetUserIngredientUnitModel | null;
};

export type GetUserIngredientCategoryModel = {
  id: string;
  name: string;
};

export type GetUserIngredientUnitModel = {
  id: string;
  name: string;
  abbreviation: string;
  type: string;
};
