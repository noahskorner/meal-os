import type { ListIngredientResponse } from "@repo/web-api-client";

export type RecipeIngredient = ListIngredientResponse & {
  sortOrder: number;
};

export const createIngredient = (name: string): ListIngredientResponse => ({
  id: `new-${Date.now()}`,
  name,
  aliases: [],
  category: {
    id: `new-category-${Date.now()}`,
    name: "Custom",
  },
  defaultUnit: {
    id: `new-unit-${Date.now()}`,
    name: "to taste",
    abbreviation: "",
    type: "CUSTOM",
  },
});

export const updateSortOrder = (items: RecipeIngredient[]) =>
  items.map((item, sortOrder) => ({ ...item, sortOrder }));
