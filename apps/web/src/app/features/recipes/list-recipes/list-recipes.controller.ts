import type { AuthProvider } from "@/app/features/auth/auth-provider";
import type { ListRecipesQueryRequest } from "./list-recipes.request";
import {
  createListRecipesResponseDto,
  createListRecipesUnauthorizedResponseDto,
  createListRecipesValidationErrorResponseDto,
  type ListRecipesResponseDto,
  type ListRecipesUnauthorizedResponseDto,
  type ListRecipesValidationErrorResponseDto,
} from "./list-recipes.dto";
import { ListRecipesFacade } from "./list-recipes.facade";

export type ListRecipesResult =
  | {
      status: 200;
      body: ListRecipesResponseDto;
    }
  | {
      status: 401;
      body: ListRecipesUnauthorizedResponseDto;
    }
  | {
      status: 400;
      body: ListRecipesValidationErrorResponseDto;
    };

export class ListRecipesController {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly listRecipesFacade: ListRecipesFacade,
  ) {}

  public async get(
    request: ListRecipesQueryRequest,
  ): Promise<ListRecipesResult> {
    const currentUser = await this.authProvider.getCurrentUser();

    if (!currentUser) {
      return {
        status: 401,
        body: createListRecipesUnauthorizedResponseDto(),
      };
    }

    const recipes = await this.listRecipesFacade.list({
      createdById: currentUser.id,
      searchTerm: request.searchTerm,
      page: request.page,
      pageSize: request.pageSize,
    });

    return {
      status: 200,
      body: createListRecipesResponseDto(recipes),
    };
  }
}

export function createListRecipesValidationError(
  issues: string[],
): ListRecipesValidationErrorResponseDto {
  return createListRecipesValidationErrorResponseDto(issues);
}
