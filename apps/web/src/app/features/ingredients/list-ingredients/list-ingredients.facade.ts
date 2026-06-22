import type { PaginatedResponse } from "../../paginated.response";
import type { ListIngredientsModel } from "./list-ingredients.model";
import type { ListIngredientsRequest } from "./list-ingredients.request";
import { ListIngredientsService } from "./list-ingredients.service";

export class ListIngredientsFacade {
  constructor(
    private readonly listIngredientsService: ListIngredientsService,
  ) {}

  public async list(
    request: ListIngredientsRequest,
  ): Promise<PaginatedResponse<ListIngredientsModel>> {
    return this.listIngredientsService.list(request);
  }
}
