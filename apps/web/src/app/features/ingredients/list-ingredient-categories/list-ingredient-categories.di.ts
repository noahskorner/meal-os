import type { ServiceCollection } from "@repo/dependency-injection";
import { SERVICE_TOKENS } from "@/app/features/service-tokens";
import { ListIngredientCategoriesController } from "./list-ingredient-categories.controller";
import { ListIngredientCategoriesFacade } from "./list-ingredient-categories.facade";
import { ListIngredientCategoriesRepository } from "./list-ingredient-categories.repository";
import { ListIngredientCategoriesService } from "./list-ingredient-categories.service";

export function registerListIngredientCategories(services: ServiceCollection) {
  services.registerScoped(
    SERVICE_TOKENS.listIngredientCategoriesRepository,
    async (scope) => {
      return new ListIngredientCategoriesRepository(
        await scope.resolve(SERVICE_TOKENS.prisma),
      );
    },
  );

  services.registerScoped(
    SERVICE_TOKENS.listIngredientCategoriesService,
    () => {
      return new ListIngredientCategoriesService();
    },
  );

  services.registerScoped(
    SERVICE_TOKENS.listIngredientCategoriesFacade,
    async (scope) => {
      return new ListIngredientCategoriesFacade(
        await scope.resolve(SERVICE_TOKENS.listIngredientCategoriesService),
        await scope.resolve(SERVICE_TOKENS.listIngredientCategoriesRepository),
      );
    },
  );

  services.registerScoped(
    SERVICE_TOKENS.listIngredientCategoriesController,
    async (scope) => {
      return new ListIngredientCategoriesController(
        await scope.resolve(SERVICE_TOKENS.listIngredientCategoriesFacade),
      );
    },
  );
}
