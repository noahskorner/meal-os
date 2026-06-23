import type { CreateRecipeRequest } from "./create-recipe.request";
import type { CreateRecipeModel } from "./create-recipe.model";

export class CreateRecipeService {
  public createRecipe(
    request: CreateRecipeRequest & { createdById: string },
  ): CreateRecipeModel {
    return {
      createdById: request.createdById,
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
        ingredientId: step.ingredientId ?? null,
        text: step.text,
        sortOrder: step.sortOrder,
      })),
    };
  }
}
