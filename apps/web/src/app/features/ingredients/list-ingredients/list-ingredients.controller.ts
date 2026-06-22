import type { ListIngredientsRequest } from "./list-ingredients.request";
import {
  createListIngredientsResponse,
  createListIngredientsValidationErrorResponse,
  type ListIngredientsResponse,
  type ListIngredientsValidationErrorResponse,
} from "./list-ingredients.response";
import { ListIngredientsFacade } from "./list-ingredients.facade";

export type ListIngredientsResult =
  | {
      status: 200;
      body: ListIngredientsResponse;
    }
  | {
      status: 400;
      body: ListIngredientsValidationErrorResponse;
    };

export class ListIngredientsController {
  constructor(
    private readonly listIngredientsFacade: ListIngredientsFacade,
  ) {}

  public async get(
    request: ListIngredientsRequest,
  ): Promise<ListIngredientsResult> {
    const ingredients = await this.listIngredientsFacade.list(request);

    return {
      status: 200,
      body: createListIngredientsResponse(ingredients),
    };
  }
}

export function createListIngredientsValidationError(
  issues: string[],
): ListIngredientsValidationErrorResponse {
  return createListIngredientsValidationErrorResponse(issues);
}
