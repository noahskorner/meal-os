import type { ServiceCollection } from "@repo/dependency-injection";
import { SERVICE_TOKENS } from "@/app/features/service-tokens";
import { ListUserIngredientsController } from "./list-user-ingredients.controller";
import { ListUserIngredientsFacade } from "./list-user-ingredients.facade";
import { ListUserIngredientsRepository } from "./list-user-ingredients.repository";
import { ListUserIngredientsService } from "./list-user-ingredients.service";

export function registerListUserIngredients(services: ServiceCollection) {
  services.registerScoped(
    SERVICE_TOKENS.listUserIngredientsRepository,
    async (scope) => {
      return new ListUserIngredientsRepository(
        await scope.resolve(SERVICE_TOKENS.prisma),
      );
    },
  );

  services.registerScoped(SERVICE_TOKENS.listUserIngredientsService, () => {
    return new ListUserIngredientsService();
  });

  services.registerScoped(
    SERVICE_TOKENS.listUserIngredientsFacade,
    async (scope) => {
      return new ListUserIngredientsFacade(
        await scope.resolve(SERVICE_TOKENS.listUserIngredientsService),
        await scope.resolve(SERVICE_TOKENS.listUserIngredientsRepository),
      );
    },
  );

  services.registerScoped(
    SERVICE_TOKENS.listUserIngredientsController,
    async (scope) => {
      return new ListUserIngredientsController(
        await scope.resolve(SERVICE_TOKENS.authProvider),
        await scope.resolve(SERVICE_TOKENS.listUserIngredientsFacade),
      );
    },
  );
}
