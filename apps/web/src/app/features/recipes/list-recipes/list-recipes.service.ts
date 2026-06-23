import type { ListRecipeModel } from "./list-recipes.model";
import type { ListRecipesResponse } from "./list-recipes.response";

export class ListRecipesService {
  public createListResponse(items: ListRecipeModel[]): ListRecipesResponse {
    return {
      items,
    };
  }
}
