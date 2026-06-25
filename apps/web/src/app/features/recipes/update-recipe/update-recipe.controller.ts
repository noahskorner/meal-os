import type { AuthProvider } from "@/app/features/auth/auth-provider";
import type { UpdateRecipeRequest } from "./update-recipe.request";
import {
  createUpdateRecipeNotFoundResponseDto,
  createUpdateRecipeUnauthorizedResponseDto,
  createUpdateRecipeValidationErrorResponseDto,
  type UpdateRecipeNotFoundResponseDto,
  type UpdateRecipeUnauthorizedResponseDto,
  type UpdateRecipeValidationErrorResponseDto,
} from "./update-recipe.dto";
import { UpdateRecipeFacade } from "./update-recipe.facade";

export type UpdateRecipeResult =
  | {
      status: 204;
    }
  | {
      status: 401;
      body: UpdateRecipeUnauthorizedResponseDto;
    }
  | {
      status: 404;
      body: UpdateRecipeNotFoundResponseDto;
    };

export class UpdateRecipeController {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly updateRecipeFacade: UpdateRecipeFacade,
  ) {}

  public async put(request: UpdateRecipeRequest): Promise<UpdateRecipeResult> {
    const currentUser = await this.authProvider.getCurrentUser();

    if (!currentUser) {
      return {
        status: 401,
        body: createUpdateRecipeUnauthorizedResponseDto(),
      };
    }

    const updatedRecipe = await this.updateRecipeFacade.updateOwnedById(
      request,
      currentUser.id,
    );

    if (!updatedRecipe) {
      return {
        status: 404,
        body: createUpdateRecipeNotFoundResponseDto(),
      };
    }

    return {
      status: 204,
    };
  }
}

export function createUpdateRecipeValidationError(
  issues: string[],
): UpdateRecipeValidationErrorResponseDto {
  return createUpdateRecipeValidationErrorResponseDto(issues);
}
