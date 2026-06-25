import type { PaginatedResponse } from "../../paginated.response";
import type { ListUserIngredientModel } from "./list-user-ingredients.model";
import type { FindManyUserIngredientsParams } from "./list-user-ingredients.repository";
import type { ListUserIngredientsRequest } from "./list-user-ingredients.request";

export class ListUserIngredientsService {
  public createFindManyParams(
    request: ListUserIngredientsRequest,
  ): FindManyUserIngredientsParams {
    return {
      createdById: request.createdById,
      searchTerm: request.searchTerm,
      skip: (request.page - 1) * request.pageSize,
      take: request.pageSize,
    };
  }

  public createListResponse(params: {
    items: ListUserIngredientModel[];
    page: number;
    pageSize: number;
    totalItems: number;
  }): PaginatedResponse<ListUserIngredientModel> {
    return {
      items: params.items,
      page: params.page,
      pageSize: params.pageSize,
      totalItems: params.totalItems,
      totalPages: Math.ceil(params.totalItems / params.pageSize),
    };
  }
}
