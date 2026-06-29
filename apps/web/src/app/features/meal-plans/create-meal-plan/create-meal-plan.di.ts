import type { ServiceCollection } from "@repo/dependency-injection";
import { SERVICE_TOKENS } from "@/app/features/service-tokens";
import { CreateMealPlanController } from "./create-meal-plan.controller";
import { CreateMealPlanFacade } from "./create-meal-plan.facade";
import { CreateMealPlanRepository } from "./create-meal-plan.repository";
import { CreateMealPlanService } from "./create-meal-plan.service";

export function registerCreateMealPlan(services: ServiceCollection) {
  services.registerScoped(
    SERVICE_TOKENS.createMealPlanRepository,
    async (scope) => {
      return new CreateMealPlanRepository(
        await scope.resolve(SERVICE_TOKENS.prisma),
      );
    },
  );

  services.registerScoped(SERVICE_TOKENS.createMealPlanService, () => {
    return new CreateMealPlanService();
  });

  services.registerScoped(SERVICE_TOKENS.createMealPlanFacade, async (scope) => {
    return new CreateMealPlanFacade(
      await scope.resolve(SERVICE_TOKENS.createMealPlanService),
      await scope.resolve(SERVICE_TOKENS.createMealPlanRepository),
    );
  });

  services.registerScoped(
    SERVICE_TOKENS.createMealPlanController,
    async (scope) => {
      return new CreateMealPlanController(
        await scope.resolve(SERVICE_TOKENS.authProvider),
        await scope.resolve(SERVICE_TOKENS.createMealPlanFacade),
      );
    },
  );
}
