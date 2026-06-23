import type { PaginatedResponse } from "../../paginated.response";
import type { ListIngredientsRequest } from "./list-ingredients.request";
import type { ListIngredientsModel } from "./list-ingredients.model";
import { ListIngredientsRepository } from "./list-ingredients.repository";

export class ListIngredientsService {
  constructor(
    private readonly listIngredientsRepository: ListIngredientsRepository,
  ) {}

  public async list(
    request: ListIngredientsRequest,
  ): Promise<PaginatedResponse<ListIngredientsModel>> {
    const skip = (request.page - 1) * request.pageSize;
    const [items, totalItems] = await Promise.all([
      this.listIngredientsRepository.findMany({
        skip,
        take: request.pageSize,
        searchTerm: request.searchTerm,
      }),
      this.listIngredientsRepository.count(request.searchTerm),
    ]);

    return {
      items,
      page: request.page,
      pageSize: request.pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / request.pageSize),
    };
  }
}
