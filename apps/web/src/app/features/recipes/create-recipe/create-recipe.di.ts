import type { ServiceCollection } from "@repo/dependency-injection";
import { SERVICE_TOKENS } from "@/app/features/service-tokens";
import { CreateRecipeController } from "./create-recipe.controller";
import { CreateRecipeFacade } from "./create-recipe.facade";
import { CreateRecipeRepository } from "./create-recipe.repository";
import { CreateRecipeService } from "./create-recipe.service";

export function registerCreateRecipe(services: ServiceCollection) {
  services.registerScoped(
    SERVICE_TOKENS.createRecipeRepository,
    async (scope) => {
      return new CreateRecipeRepository(
        await scope.resolve(SERVICE_TOKENS.prisma),
      );
    },
  );

  services.registerScoped(SERVICE_TOKENS.createRecipeService, () => {
    return new CreateRecipeService();
  });

  services.registerScoped(SERVICE_TOKENS.createRecipeFacade, async (scope) => {
    return new CreateRecipeFacade(
      await scope.resolve(SERVICE_TOKENS.createRecipeService),
      await scope.resolve(SERVICE_TOKENS.createRecipeRepository),
    );
  });

  services.registerScoped(
    SERVICE_TOKENS.createRecipeController,
    async (scope) => {
      return new CreateRecipeController(
        await scope.resolve(SERVICE_TOKENS.authProvider),
        await scope.resolve(SERVICE_TOKENS.createRecipeFacade),
      );
    },
  );
}
