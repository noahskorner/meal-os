import type { ListIngredientsRequest } from "./list-ingredients.request";
import {
  createListIngredientsResponseDto,
  createListIngredientsValidationErrorResponseDto,
  type ListIngredientsResponseDto,
  type ListIngredientsValidationErrorResponseDto,
} from "./list-ingredients.dto";
import { ListIngredientsFacade } from "./list-ingredients.facade";

export type ListIngredientsResult =
  | {
      status: 200;
      body: ListIngredientsResponseDto;
    }
  | {
      status: 400;
      body: ListIngredientsValidationErrorResponseDto;
    };

export class ListIngredientsController {
  constructor(private readonly listIngredientsFacade: ListIngredientsFacade) {}

  public async get(
    request: ListIngredientsRequest,
  ): Promise<ListIngredientsResult> {
    const ingredients = await this.listIngredientsFacade.list(request);

    return {
      status: 200,
      body: createListIngredientsResponseDto(ingredients),
    };
  }
}

export function createListIngredientsValidationError(
  issues: string[],
): ListIngredientsValidationErrorResponseDto {
  return createListIngredientsValidationErrorResponseDto(issues);
}
