import type { CreateRecipeRequest } from "./create-recipe.request";
import { CreateRecipeRepository } from "./create-recipe.repository";
import type { CreateRecipeResponse } from "./create-recipe.response";
import { CreateRecipeService } from "./create-recipe.service";

export class CreateRecipeFacade {
  constructor(
    private readonly createRecipeService: CreateRecipeService,
    private readonly createRecipeRepository: CreateRecipeRepository,
  ) {}

  public async create(
    request: CreateRecipeRequest & { createdById: string },
  ): Promise<CreateRecipeResponse> {
    const recipe = this.createRecipeService.createRecipe(request);

    return this.createRecipeRepository.create(recipe);
  }
}
