import type { AuthProvider } from "@/app/features/auth/auth-provider";
import type { GetRecipeRequest } from "./get-recipe.request";
import {
  createGetRecipeNotFoundResponseDto,
  createGetRecipeResponseDto,
  createGetRecipeUnauthorizedResponseDto,
  createGetRecipeValidationErrorResponseDto,
  type GetRecipeNotFoundResponseDto,
  type GetRecipeResponseDto,
  type GetRecipeUnauthorizedResponseDto,
  type GetRecipeValidationErrorResponseDto,
} from "./get-recipe.dto";
import { GetRecipeFacade } from "./get-recipe.facade";

export type GetRecipeResult =
  | {
      status: 200;
      body: GetRecipeResponseDto;
    }
  | {
      status: 401;
      body: GetRecipeUnauthorizedResponseDto;
    }
  | {
      status: 404;
      body: GetRecipeNotFoundResponseDto;
    };

export class GetRecipeController {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly getRecipeFacade: GetRecipeFacade,
  ) {}

  public async get(request: GetRecipeRequest): Promise<GetRecipeResult> {
    const currentUser = await this.authProvider.getCurrentUser();

    if (!currentUser) {
      return {
        status: 401,
        body: createGetRecipeUnauthorizedResponseDto(),
      };
    }

    const recipe = await this.getRecipeFacade.getVisibleById(request.id, {
      currentUserId: currentUser.id,
    });

    if (!recipe) {
      return {
        status: 404,
        body: createGetRecipeNotFoundResponseDto(),
      };
    }

    return {
      status: 200,
      body: createGetRecipeResponseDto(recipe),
    };
  }
}

export function createGetRecipeValidationError(
  issues: string[],
): GetRecipeValidationErrorResponseDto {
  return createGetRecipeValidationErrorResponseDto(issues);
}
