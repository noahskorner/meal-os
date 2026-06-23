import type { PaginatedResponse } from "../../paginated.response";
import type { ListIngredientsModel } from "./list-ingredients.model";
import type { FindManyIngredientsParams } from "./list-ingredients.repository";
import type { ListIngredientsRequest } from "./list-ingredients.request";

export class ListIngredientsService {
  public createFindManyParams(
    request: ListIngredientsRequest,
  ): FindManyIngredientsParams {
    return {
      skip: (request.page - 1) * request.pageSize,
      take: request.pageSize,
      searchTerm: request.searchTerm,
    };
  }

  public createListResponse(params: {
    items: ListIngredientsModel[];
    page: number;
    pageSize: number;
    totalItems: number;
  }): PaginatedResponse<ListIngredientsModel> {
    return {
      items: params.items,
      page: params.page,
      pageSize: params.pageSize,
      totalItems: params.totalItems,
      totalPages: Math.ceil(params.totalItems / params.pageSize),
    };
  }
}
