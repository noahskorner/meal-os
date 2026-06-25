import type { ListIngredientCategoryModel } from "./list-ingredient-categories.model";
import type { ListIngredientCategoriesResponse } from "./list-ingredient-categories.response";

export class ListIngredientCategoriesService {
  public createListResponse(
    categories: ListIngredientCategoryModel[],
  ): ListIngredientCategoriesResponse {
    return categories;
  }
}
