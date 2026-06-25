import type { UpdateRecipeModel } from "./update-recipe.model";
import type { UpdateRecipeBodyRequest } from "./update-recipe.request";

export class UpdateRecipeService {
  public createRecipeUpdate(
    id: string,
    request: UpdateRecipeBodyRequest,
  ): UpdateRecipeModel {
    return {
      id,
      name: request.name,
      description: request.description ?? null,
      prepTimeMinutes: request.prepTimeMinutes ?? null,
      cookTimeMinutes: request.cookTimeMinutes ?? null,
      servings: request.servings ?? null,
      recipeIngredients: (request.recipeIngredients ?? []).map(
        (ingredient) => ({
          ingredientId: ingredient.ingredientId,
          name: ingredient.name,
          quantity: ingredient.quantity ?? null,
          unitId: ingredient.unitId ?? null,
          preparation: ingredient.preparation ?? null,
          note: ingredient.note ?? null,
          isOptional: ingredient.isOptional ?? null,
        }),
      ),
      recipeSteps: (request.recipeSteps ?? []).map((step) => ({
        text: step.text,
        sortOrder: step.sortOrder,
      })),
    };
  }
}
