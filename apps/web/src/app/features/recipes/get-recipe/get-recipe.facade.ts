import { GetRecipeRepository } from "./get-recipe.repository";
import type { GetRecipeResponse } from "./get-recipe.response";
import { GetRecipeService } from "./get-recipe.service";

export type GetRecipeVisibility = {
  currentUserId: string;
};

export class GetRecipeFacade {
  constructor(
    private readonly getRecipeService: GetRecipeService,
    private readonly getRecipeRepository: GetRecipeRepository,
  ) {}

  public async getVisibleById(
    id: string,
    visibility: GetRecipeVisibility,
  ): Promise<GetRecipeResponse | null> {
    const recipe = await this.getRecipeRepository.findVisibleById(id, {
      currentUserId: visibility.currentUserId,
    });

    if (!recipe) {
      return null;
    }

    return this.getRecipeService.createRecipeResponse(recipe);
  }
}
