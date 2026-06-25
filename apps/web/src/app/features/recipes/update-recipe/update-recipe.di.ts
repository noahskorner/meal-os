import type { ServiceCollection } from "@repo/dependency-injection";
import { SERVICE_TOKENS } from "@/app/features/service-tokens";
import { UpdateRecipeController } from "./update-recipe.controller";
import { UpdateRecipeFacade } from "./update-recipe.facade";
import { UpdateRecipeRepository } from "./update-recipe.repository";
import { UpdateRecipeService } from "./update-recipe.service";

export function registerUpdateRecipe(services: ServiceCollection) {
  services.registerScoped(
    SERVICE_TOKENS.updateRecipeRepository,
    async (scope) => {
      return new UpdateRecipeRepository(
        await scope.resolve(SERVICE_TOKENS.prisma),
      );
    },
  );

  services.registerScoped(SERVICE_TOKENS.updateRecipeService, () => {
    return new UpdateRecipeService();
  });

  services.registerScoped(SERVICE_TOKENS.updateRecipeFacade, async (scope) => {
    return new UpdateRecipeFacade(
      await scope.resolve(SERVICE_TOKENS.updateRecipeService),
      await scope.resolve(SERVICE_TOKENS.updateRecipeRepository),
    );
  });

  services.registerScoped(
    SERVICE_TOKENS.updateRecipeController,
    async (scope) => {
      return new UpdateRecipeController(
        await scope.resolve(SERVICE_TOKENS.authProvider),
        await scope.resolve(SERVICE_TOKENS.updateRecipeFacade),
      );
    },
  );
}
