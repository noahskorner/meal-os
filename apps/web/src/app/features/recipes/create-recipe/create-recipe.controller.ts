import type { AuthProvider } from "@/app/features/auth/auth-provider";
import type { CreateRecipeRequest } from "./create-recipe.request";
import {
  createCreateRecipeResponseDto,
  createRecipeUnauthorizedResponseDto,
  createRecipeValidationErrorResponseDto,
  type CreateRecipeResponseDto,
  type CreateRecipeUnauthorizedResponseDto,
  type CreateRecipeValidationErrorResponseDto,
} from "./create-recipe.dto";
import { CreateRecipeFacade } from "./create-recipe.facade";

export type CreateRecipeResult =
  | {
      status: 201;
      body: CreateRecipeResponseDto;
      headers: {
        Location: string;
      };
    }
  | {
      status: 401;
      body: CreateRecipeUnauthorizedResponseDto;
    };

export class CreateRecipeController {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly createRecipeFacade: CreateRecipeFacade,
  ) {}

  public async post(request: CreateRecipeRequest): Promise<CreateRecipeResult> {
    const currentUser = await this.authProvider.getCurrentUser();

    if (!currentUser) {
      return {
        status: 401,
        body: createRecipeUnauthorizedResponseDto(),
      };
    }

    const recipe = await this.createRecipeFacade.create({
      ...request,
      createdById: currentUser.id,
    });
    const location = `/api/recipes/${recipe.id}`;

    return {
      status: 201,
      headers: {
        Location: location,
      },
      body: createCreateRecipeResponseDto(recipe, location),
    };
  }
}

export function createCreateRecipeValidationError(
  issues: string[],
): CreateRecipeValidationErrorResponseDto {
  return createRecipeValidationErrorResponseDto(issues);
}
