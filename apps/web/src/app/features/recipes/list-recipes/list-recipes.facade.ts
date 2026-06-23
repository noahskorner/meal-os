import type { ListRecipesRequest } from "./list-recipes.request";
import { ListRecipesRepository } from "./list-recipes.repository";
import type { ListRecipesResponse } from "./list-recipes.response";
import { ListRecipesService } from "./list-recipes.service";

export class ListRecipesFacade {
  constructor(
    private readonly listRecipesService: ListRecipesService,
    private readonly listRecipesRepository: ListRecipesRepository,
  ) {}

  public async list(
    request: ListRecipesRequest,
  ): Promise<ListRecipesResponse> {
    const recipes = await this.listRecipesRepository.findManyByCreatedById(
      request.createdById,
    );

    return this.listRecipesService.createListResponse(recipes);
  }
}
