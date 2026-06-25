import type { ServiceCollection } from "@repo/dependency-injection";
import { SERVICE_TOKENS } from "@/app/features/service-tokens";
import { CreateUserIngredientController } from "./create-user-ingredient.controller";
import { CreateUserIngredientFacade } from "./create-user-ingredient.facade";
import { CreateUserIngredientRepository } from "./create-user-ingredient.repository";
import { CreateUserIngredientService } from "./create-user-ingredient.service";

export function registerCreateUserIngredient(services: ServiceCollection) {
  services.registerScoped(
    SERVICE_TOKENS.createUserIngredientRepository,
    async (scope) => {
      return new CreateUserIngredientRepository(
        await scope.resolve(SERVICE_TOKENS.prisma),
      );
    },
  );

  services.registerScoped(SERVICE_TOKENS.createUserIngredientService, () => {
    return new CreateUserIngredientService();
  });

  services.registerScoped(
    SERVICE_TOKENS.createUserIngredientFacade,
    async (scope) => {
      return new CreateUserIngredientFacade(
        await scope.resolve(SERVICE_TOKENS.createUserIngredientService),
        await scope.resolve(SERVICE_TOKENS.createUserIngredientRepository),
      );
    },
  );

  services.registerScoped(
    SERVICE_TOKENS.createUserIngredientController,
    async (scope) => {
      return new CreateUserIngredientController(
        await scope.resolve(SERVICE_TOKENS.authProvider),
        await scope.resolve(SERVICE_TOKENS.createUserIngredientFacade),
      );
    },
  );
}
