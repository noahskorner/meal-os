import type { ServiceCollection } from "@repo/dependency-injection";
import { SERVICE_TOKENS } from "@/app/features/service-tokens";
import { ListRecipesController } from "./list-recipes.controller";
import { ListRecipesFacade } from "./list-recipes.facade";
import { ListRecipesRepository } from "./list-recipes.repository";
import { ListRecipesService } from "./list-recipes.service";

export function registerListRecipes(services: ServiceCollection) {
  services.registerScoped(
    SERVICE_TOKENS.listRecipesRepository,
    async (scope) => {
      return new ListRecipesRepository(
        await scope.resolve(SERVICE_TOKENS.prisma),
      );
    },
  );

  services.registerScoped(SERVICE_TOKENS.listRecipesService, () => {
    return new ListRecipesService();
  });

  services.registerScoped(SERVICE_TOKENS.listRecipesFacade, async (scope) => {
    return new ListRecipesFacade(
      await scope.resolve(SERVICE_TOKENS.listRecipesService),
      await scope.resolve(SERVICE_TOKENS.listRecipesRepository),
    );
  });

  services.registerScoped(
    SERVICE_TOKENS.listRecipesController,
    async (scope) => {
      return new ListRecipesController(
        await scope.resolve(SERVICE_TOKENS.authProvider),
        await scope.resolve(SERVICE_TOKENS.listRecipesFacade),
      );
    },
  );
}
