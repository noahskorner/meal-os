import type { CreateMealPlanModel } from "./create-meal-plan.model";
import type { CreateMealPlanRequest } from "./create-meal-plan.request";

function parseDateOnly(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

export class CreateMealPlanService {
  public createMealPlan(
    request: CreateMealPlanRequest & { createdById: string },
  ): CreateMealPlanModel {
    return {
      createdById: request.createdById,
      entries: request.entries.map((entry) => ({
        date: parseDateOnly(entry.date),
        recipeIds: entry.recipeIds ?? [],
      })),
    };
  }
}
