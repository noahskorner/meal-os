import type { AuthProvider } from "@/app/features/auth/auth-provider";
import type { CreateMealPlanRequest } from "./create-meal-plan.request";
import {
  createCreateMealPlanResponseDto,
  createMealPlanUnauthorizedResponseDto,
  createMealPlanValidationErrorResponseDto,
  type CreateMealPlanResponseDto,
  type CreateMealPlanUnauthorizedResponseDto,
  type CreateMealPlanValidationErrorResponseDto,
} from "./create-meal-plan.dto";
import { CreateMealPlanFacade } from "./create-meal-plan.facade";

export type CreateMealPlanResult =
  | {
      status: 201;
      body: CreateMealPlanResponseDto;
      headers: {
        Location: string;
      };
    }
  | {
      status: 401;
      body: CreateMealPlanUnauthorizedResponseDto;
    };

export class CreateMealPlanController {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly createMealPlanFacade: CreateMealPlanFacade,
  ) {}

  public async post(
    request: CreateMealPlanRequest,
  ): Promise<CreateMealPlanResult> {
    const currentUser = await this.authProvider.getCurrentUser();

    if (!currentUser) {
      return {
        status: 401,
        body: createMealPlanUnauthorizedResponseDto(),
      };
    }

    const mealPlan = await this.createMealPlanFacade.create({
      ...request,
      createdById: currentUser.id,
    });
    const location = `/api/meal-plans/${mealPlan.id}`;

    return {
      status: 201,
      body: createCreateMealPlanResponseDto(mealPlan, location),
      headers: {
        Location: location,
      },
    };
  }
}

export function createCreateMealPlanValidationError(
  issues: string[],
): CreateMealPlanValidationErrorResponseDto {
  return createMealPlanValidationErrorResponseDto(issues);
}
