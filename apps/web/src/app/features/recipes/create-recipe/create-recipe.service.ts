import type { CreateRecipeRequest } from "./create-recipe.request";
import { CreateRecipeRepository } from "./create-recipe.repository";

export class CreateRecipeService {
  constructor(
    private readonly createRecipeRepository: CreateRecipeRepository,
  ) {}

  public async create(
    request: CreateRecipeRequest & { createdById: string },
  ): Promise<{ id: string }> {
    return this.createRecipeRepository.create(request);
  }
}
