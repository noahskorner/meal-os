import type { ListRecipeModel } from "./list-recipes.model";

export type ListRecipeResponse = ListRecipeModel;

export type ListRecipesResponse = {
  items: ListRecipeResponse[];
};
