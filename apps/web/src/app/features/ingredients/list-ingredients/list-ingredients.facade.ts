import { ListIngredientsRepository } from "./list-ingredients.repository";
import type { ListIngredientsRequest } from "./list-ingredients.request";
import type { ListIngredientsResponse } from "./list-ingredients.response";
import { ListIngredientsService } from "./list-ingredients.service";

export class ListIngredientsFacade {
  constructor(
    private readonly listIngredientsService: ListIngredientsService,
    private readonly listIngredientsRepository: ListIngredientsRepository,
  ) {}

  public async list(
    request: ListIngredientsRequest,
  ): Promise<ListIngredientsResponse> {
    const params = this.listIngredientsService.createFindManyParams(request);
    const [items, totalItems] = await Promise.all([
      this.listIngredientsRepository.findMany(params),
      this.listIngredientsRepository.count(request.searchTerm),
    ]);

    return this.listIngredientsService.createListResponse({
      items,
      page: request.page,
      pageSize: request.pageSize,
      totalItems,
    });
  }
}
