import { UpdateRecipeRepository } from "./update-recipe.repository";
import type { UpdateRecipeRequest } from "./update-recipe.request";
import type { UpdateRecipeResponse } from "./update-recipe.response";
import { UpdateRecipeService } from "./update-recipe.service";

export class UpdateRecipeFacade {
  constructor(
    private readonly updateRecipeService: UpdateRecipeService,
    private readonly updateRecipeRepository: UpdateRecipeRepository,
  ) {}

  public async updateOwnedById(
    request: UpdateRecipeRequest,
    currentUserId: string,
  ): Promise<UpdateRecipeResponse | null> {
    const recipeUpdate = this.updateRecipeService.createRecipeUpdate(
      request.recipeId,
      request.body,
    );

    return this.updateRecipeRepository.updateOwnedById(recipeUpdate, {
      currentUserId,
    });
  }
}
