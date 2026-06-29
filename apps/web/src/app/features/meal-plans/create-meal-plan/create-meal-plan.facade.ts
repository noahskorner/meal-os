import type { CreateMealPlanRequest } from "./create-meal-plan.request";
import { CreateMealPlanRepository } from "./create-meal-plan.repository";
import type { CreateMealPlanResponse } from "./create-meal-plan.response";
import { CreateMealPlanService } from "./create-meal-plan.service";

export class CreateMealPlanFacade {
  constructor(
    private readonly createMealPlanService: CreateMealPlanService,
    private readonly createMealPlanRepository: CreateMealPlanRepository,
  ) {}

  public async create(
    request: CreateMealPlanRequest & { createdById: string },
  ): Promise<CreateMealPlanResponse> {
    const mealPlan = this.createMealPlanService.createMealPlan(request);

    return this.createMealPlanRepository.create(mealPlan);
  }
}
