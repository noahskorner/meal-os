import type { ServiceCollection } from "@repo/dependency-injection";
import { SERVICE_TOKENS } from "@/app/features/service-tokens";
import { GetUserIngredientController } from "./get-user-ingredient.controller";
import { GetUserIngredientFacade } from "./get-user-ingredient.facade";
import { GetUserIngredientRepository } from "./get-user-ingredient.repository";
import { GetUserIngredientService } from "./get-user-ingredient.service";

export function registerGetUserIngredient(services: ServiceCollection) {
  services.registerScoped(
    SERVICE_TOKENS.getUserIngredientRepository,
    async (scope) => {
      return new GetUserIngredientRepository(
        await scope.resolve(SERVICE_TOKENS.prisma),
      );
    },
  );

  services.registerScoped(SERVICE_TOKENS.getUserIngredientService, () => {
    return new GetUserIngredientService();
  });

  services.registerScoped(
    SERVICE_TOKENS.getUserIngredientFacade,
    async (scope) => {
      return new GetUserIngredientFacade(
        await scope.resolve(SERVICE_TOKENS.getUserIngredientService),
        await scope.resolve(SERVICE_TOKENS.getUserIngredientRepository),
      );
    },
  );

  services.registerScoped(
    SERVICE_TOKENS.getUserIngredientController,
    async (scope) => {
      return new GetUserIngredientController(
        await scope.resolve(SERVICE_TOKENS.authProvider),
        await scope.resolve(SERVICE_TOKENS.getUserIngredientFacade),
      );
    },
  );
}
