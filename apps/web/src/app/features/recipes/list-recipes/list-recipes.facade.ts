import type { ListRecipesRequest } from "./list-recipes.request";
import { ListRecipesRepository } from "./list-recipes.repository";
import type { ListRecipesResponse } from "./list-recipes.response";
import { ListRecipesService } from "./list-recipes.service";

export class ListRecipesFacade {
  constructor(
    private readonly listRecipesService: ListRecipesService,
    private readonly listRecipesRepository: ListRecipesRepository,
  ) {}

  public async list(request: ListRecipesRequest): Promise<ListRecipesResponse> {
    const params = this.listRecipesService.createFindManyParams(request);
    const [items, totalItems] = await Promise.all([
      this.listRecipesRepository.findMany(params),
      this.listRecipesRepository.count({
        createdById: request.createdById,
        searchTerm: request.searchTerm,
      }),
    ]);

    return this.listRecipesService.createListResponse({
      items,
      page: request.page,
      pageSize: request.pageSize,
      totalItems,
    });
  }
}
