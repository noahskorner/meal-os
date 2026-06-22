import type { CreateRecipeRequest } from "./create-recipe.request";
import { CreateRecipeService } from "./create-recipe.service";

export class CreateRecipeFacade {
  constructor(
    private readonly createRecipeService: CreateRecipeService,
  ) {}

  public async create(
    request: CreateRecipeRequest & { createdById: string },
  ): Promise<{ id: string }> {
    return this.createRecipeService.create(request);
  }
}
