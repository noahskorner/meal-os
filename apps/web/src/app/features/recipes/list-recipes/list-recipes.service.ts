import type { PaginatedResponse } from "../../paginated.response";
import type { ListRecipeModel } from "./list-recipes.model";
import type { FindManyRecipesParams } from "./list-recipes.repository";
import type { ListRecipesRequest } from "./list-recipes.request";
import type { ListRecipesResponse } from "./list-recipes.response";

export class ListRecipesService {
  public createFindManyParams(
    request: ListRecipesRequest,
  ): FindManyRecipesParams {
    return {
      createdById: request.createdById,
      skip: (request.page - 1) * request.pageSize,
      take: request.pageSize,
    };
  }

  public createListResponse(params: {
    items: ListRecipeModel[];
    page: number;
    pageSize: number;
    totalItems: number;
  }): PaginatedResponse<ListRecipeModel> {
    return {
      items: params.items,
      page: params.page,
      pageSize: params.pageSize,
      totalItems: params.totalItems,
      totalPages: Math.ceil(params.totalItems / params.pageSize),
    };
  }
}
