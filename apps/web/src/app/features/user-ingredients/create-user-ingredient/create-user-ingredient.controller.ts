import type { AuthProvider } from "@/app/features/auth/auth-provider";
import type { CreateUserIngredientRequest } from "./create-user-ingredient.request";
import {
  createCreateUserIngredientResponseDto,
  createUserIngredientUnauthorizedResponseDto,
  createUserIngredientValidationErrorResponseDto,
  type CreateUserIngredientResponseDto,
  type CreateUserIngredientUnauthorizedResponseDto,
  type CreateUserIngredientValidationErrorResponseDto,
} from "./create-user-ingredient.dto";
import { CreateUserIngredientFacade } from "./create-user-ingredient.facade";

export type CreateUserIngredientResult =
  | {
      status: 201;
      body: CreateUserIngredientResponseDto;
      headers: {
        Location: string;
      };
    }
  | {
      status: 401;
      body: CreateUserIngredientUnauthorizedResponseDto;
    };

export class CreateUserIngredientController {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly createUserIngredientFacade: CreateUserIngredientFacade,
  ) {}

  public async post(
    request: CreateUserIngredientRequest,
  ): Promise<CreateUserIngredientResult> {
    const currentUser = await this.authProvider.getCurrentUser();

    if (!currentUser) {
      return {
        status: 401,
        body: createUserIngredientUnauthorizedResponseDto(),
      };
    }

    const userIngredient = await this.createUserIngredientFacade.create({
      ...request,
      createdById: currentUser.id,
    });
    const location = `/api/user-ingredients/${userIngredient.id}`;

    return {
      status: 201,
      body: createCreateUserIngredientResponseDto(userIngredient, location),
      headers: {
        Location: location,
      },
    };
  }
}

export function createCreateUserIngredientValidationError(
  issues: string[],
): CreateUserIngredientValidationErrorResponseDto {
  return createUserIngredientValidationErrorResponseDto(issues);
}
