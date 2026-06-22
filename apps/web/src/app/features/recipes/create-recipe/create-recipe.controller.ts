import type { AuthProvider } from "@/app/features/auth/auth-provider";
import type { CreateRecipeRequest } from "./create-recipe.request";
import {
  createCreateRecipeResponse,
  createRecipeUnauthorizedResponse,
  createRecipeValidationErrorResponse,
  type CreateRecipeResponse,
  type CreateRecipeUnauthorizedResponse,
  type CreateRecipeValidationErrorResponse,
} from "./create-recipe.response";
import { CreateRecipeFacade } from "./create-recipe.facade";

export type CreateRecipeResult =
  | {
      status: 201;
      body: CreateRecipeResponse;
      headers: {
        Location: string;
      };
    }
  | {
      status: 401;
      body: CreateRecipeUnauthorizedResponse;
    };

export class CreateRecipeController {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly createRecipeFacade: CreateRecipeFacade,
  ) {}

  public async post(
    request: CreateRecipeRequest,
  ): Promise<CreateRecipeResult> {
    const currentUser = await this.authProvider.getCurrentUser();

    if (!currentUser) {
      return {
        status: 401,
        body: createRecipeUnauthorizedResponse(),
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
      body: createCreateRecipeResponse(recipe, location),
    };
  }
}

export function createCreateRecipeValidationError(
  issues: string[],
): CreateRecipeValidationErrorResponse {
  return createRecipeValidationErrorResponse(issues);
}
