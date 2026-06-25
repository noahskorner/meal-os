import type { AuthProvider } from "@/app/features/auth/auth-provider";
import type { ListUserIngredientsQueryRequest } from "./list-user-ingredients.request";
import {
  createListUserIngredientsResponseDto,
  createListUserIngredientsUnauthorizedResponseDto,
  createListUserIngredientsValidationErrorResponseDto,
  type ListUserIngredientsResponseDto,
  type ListUserIngredientsUnauthorizedResponseDto,
  type ListUserIngredientsValidationErrorResponseDto,
} from "./list-user-ingredients.dto";
import { ListUserIngredientsFacade } from "./list-user-ingredients.facade";

export type ListUserIngredientsResult =
  | {
      status: 200;
      body: ListUserIngredientsResponseDto;
    }
  | {
      status: 401;
      body: ListUserIngredientsUnauthorizedResponseDto;
    }
  | {
      status: 400;
      body: ListUserIngredientsValidationErrorResponseDto;
    };

export class ListUserIngredientsController {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly listUserIngredientsFacade: ListUserIngredientsFacade,
  ) {}

  public async get(
    request: ListUserIngredientsQueryRequest,
  ): Promise<ListUserIngredientsResult> {
    const currentUser = await this.authProvider.getCurrentUser();

    if (!currentUser) {
      return {
        status: 401,
        body: createListUserIngredientsUnauthorizedResponseDto(),
      };
    }

    const userIngredients = await this.listUserIngredientsFacade.list({
      createdById: currentUser.id,
      searchTerm: request.searchTerm,
      page: request.page,
      pageSize: request.pageSize,
    });

    return {
      status: 200,
      body: createListUserIngredientsResponseDto(userIngredients),
    };
  }
}

export function createListUserIngredientsValidationError(
  issues: string[],
): ListUserIngredientsValidationErrorResponseDto {
  return createListUserIngredientsValidationErrorResponseDto(issues);
}
