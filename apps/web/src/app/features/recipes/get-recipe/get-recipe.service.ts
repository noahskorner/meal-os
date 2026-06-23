import type { GetRecipeModel } from "./get-recipe.model";
import type { GetRecipeResponse } from "./get-recipe.response";

export class GetRecipeService {
  public createRecipeResponse(recipe: GetRecipeModel): GetRecipeResponse {
    return {
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      prepTimeMinutes: recipe.prepTimeMinutes,
      cookTimeMinutes: recipe.cookTimeMinutes,
      servings: recipe.servings,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
    };
  }
}
