import type { PrismaClient } from "@repo/db";
import type { CreateMealPlanModel } from "./create-meal-plan.model";
import type { CreateMealPlanResponse } from "./create-meal-plan.response";

export class CreateMealPlanRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async create(
    input: CreateMealPlanModel,
  ): Promise<CreateMealPlanResponse> {
    const mealPlan = await this.prisma.mealPlan.create({
      data: {
        createdById: input.createdById,
        entries: {
          create: input.entries.map((entry) => ({
            date: entry.date,
            mealPlanEntryRecipes: {
              create: entry.recipeIds.map((recipeId, sortOrder) => ({
                recipeId,
                sortOrder,
              })),
            },
          })),
        },
      },
      select: {
        id: true,
      },
    });

    return mealPlan;
  }
}
