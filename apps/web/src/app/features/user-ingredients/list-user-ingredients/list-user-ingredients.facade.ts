import { ListUserIngredientsRepository } from "./list-user-ingredients.repository";
import type { ListUserIngredientsRequest } from "./list-user-ingredients.request";
import type { ListUserIngredientsResponse } from "./list-user-ingredients.response";
import { ListUserIngredientsService } from "./list-user-ingredients.service";

export class ListUserIngredientsFacade {
  constructor(
    private readonly listUserIngredientsService: ListUserIngredientsService,
    private readonly listUserIngredientsRepository: ListUserIngredientsRepository,
  ) {}

  public async list(
    request: ListUserIngredientsRequest,
  ): Promise<ListUserIngredientsResponse> {
    const params =
      this.listUserIngredientsService.createFindManyParams(request);
    const [items, totalItems] = await Promise.all([
      this.listUserIngredientsRepository.findMany(params),
      this.listUserIngredientsRepository.count({
        createdById: request.createdById,
        searchTerm: request.searchTerm,
      }),
    ]);

    return this.listUserIngredientsService.createListResponse({
      items,
      page: request.page,
      pageSize: request.pageSize,
      totalItems,
    });
  }
}
