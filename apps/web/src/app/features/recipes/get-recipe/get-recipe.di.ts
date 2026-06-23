import type { ServiceCollection } from "@repo/dependency-injection";
import { SERVICE_TOKENS } from "@/app/features/service-tokens";
import { GetRecipeController } from "./get-recipe.controller";
import { GetRecipeFacade } from "./get-recipe.facade";
import { GetRecipeRepository } from "./get-recipe.repository";
import { GetRecipeService } from "./get-recipe.service";

export function registerGetRecipe(services: ServiceCollection) {
  services.registerScoped(SERVICE_TOKENS.getRecipeRepository, async (scope) => {
    return new GetRecipeRepository(await scope.resolve(SERVICE_TOKENS.prisma));
  });

  services.registerScoped(SERVICE_TOKENS.getRecipeService, () => {
    return new GetRecipeService();
  });

  services.registerScoped(SERVICE_TOKENS.getRecipeFacade, async (scope) => {
    return new GetRecipeFacade(
      await scope.resolve(SERVICE_TOKENS.getRecipeService),
      await scope.resolve(SERVICE_TOKENS.getRecipeRepository),
    );
  });

  services.registerScoped(SERVICE_TOKENS.getRecipeController, async (scope) => {
    return new GetRecipeController(
      await scope.resolve(SERVICE_TOKENS.authProvider),
      await scope.resolve(SERVICE_TOKENS.getRecipeFacade),
    );
  });
}
