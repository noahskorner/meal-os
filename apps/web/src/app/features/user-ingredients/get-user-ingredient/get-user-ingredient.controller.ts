import type { AuthProvider } from "@/app/features/auth/auth-provider";
import type { GetUserIngredientRequest } from "./get-user-ingredient.request";
import {
  createGetUserIngredientNotFoundResponseDto,
  createGetUserIngredientResponseDto,
  createGetUserIngredientUnauthorizedResponseDto,
  createGetUserIngredientValidationErrorResponseDto,
  type GetUserIngredientNotFoundResponseDto,
  type GetUserIngredientResponseDto,
  type GetUserIngredientUnauthorizedResponseDto,
  type GetUserIngredientValidationErrorResponseDto,
} from "./get-user-ingredient.dto";
import { GetUserIngredientFacade } from "./get-user-ingredient.facade";

export type GetUserIngredientResult =
  | {
      status: 200;
      body: GetUserIngredientResponseDto;
    }
  | {
      status: 401;
      body: GetUserIngredientUnauthorizedResponseDto;
    }
  | {
      status: 404;
      body: GetUserIngredientNotFoundResponseDto;
    };

export class GetUserIngredientController {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly getUserIngredientFacade: GetUserIngredientFacade,
  ) {}

  public async get(
    request: GetUserIngredientRequest,
  ): Promise<GetUserIngredientResult> {
    const currentUser = await this.authProvider.getCurrentUser();

    if (!currentUser) {
      return {
        status: 401,
        body: createGetUserIngredientUnauthorizedResponseDto(),
      };
    }

    const userIngredient = await this.getUserIngredientFacade.getVisibleById(
      request.userIngredientId,
      {
        currentUserId: currentUser.id,
      },
    );

    if (!userIngredient) {
      return {
        status: 404,
        body: createGetUserIngredientNotFoundResponseDto(),
      };
    }

    return {
      status: 200,
      body: createGetUserIngredientResponseDto(userIngredient),
    };
  }
}

export function createGetUserIngredientValidationError(
  issues: string[],
): GetUserIngredientValidationErrorResponseDto {
  return createGetUserIngredientValidationErrorResponseDto(issues);
}
