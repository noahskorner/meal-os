export type ListUserIngredientModel = {
  id: string;
  name: string;
  category: ListUserIngredientCategoryModel | null;
  defaultUnit: ListUserIngredientUnitModel | null;
};

export type ListUserIngredientCategoryModel = {
  id: string;
  name: string;
};

export type ListUserIngredientUnitModel = {
  id: string;
  name: string;
  abbreviation: string;
  type: string;
};
