import type { ServiceCollection } from "@repo/dependency-injection";
import { SERVICE_TOKENS } from "@/app/features/service-tokens";
import { ListIngredientsController } from "./list-ingredients.controller";
import { ListIngredientsFacade } from "./list-ingredients.facade";
import { ListIngredientsRepository } from "./list-ingredients.repository";
import { ListIngredientsService } from "./list-ingredients.service";

export function registerListIngredients(services: ServiceCollection) {
  services.registerScoped(
    SERVICE_TOKENS.listIngredientsRepository,
    async (scope) => {
      return new ListIngredientsRepository(
        await scope.resolve(SERVICE_TOKENS.prisma),
      );
    },
  );

  services.registerScoped(SERVICE_TOKENS.listIngredientsService, () => {
    return new ListIngredientsService();
  });

  services.registerScoped(
    SERVICE_TOKENS.listIngredientsFacade,
    async (scope) => {
      return new ListIngredientsFacade(
        await scope.resolve(SERVICE_TOKENS.listIngredientsService),
        await scope.resolve(SERVICE_TOKENS.listIngredientsRepository),
      );
    },
  );

  services.registerScoped(
    SERVICE_TOKENS.listIngredientsController,
    async (scope) => {
      return new ListIngredientsController(
        await scope.resolve(SERVICE_TOKENS.listIngredientsFacade),
      );
    },
  );
}
