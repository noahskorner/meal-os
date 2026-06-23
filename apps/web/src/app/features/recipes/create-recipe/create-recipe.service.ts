import type { CreateRecipeRequest } from "./create-recipe.request";
import type { CreateRecipeInputModel } from "./create-recipe.model";

export class CreateRecipeService {
  public createRecipe(
    request: CreateRecipeRequest & { createdById: string },
  ): CreateRecipeInputModel {
    return {
      createdById: request.createdById,
      name: request.name,
      description: request.description ?? null,
      prepTimeMinutes: request.prepTimeMinutes ?? null,
      cookTimeMinutes: request.cookTimeMinutes ?? null,
      servings: request.servings ?? null,
    };
  }
}
