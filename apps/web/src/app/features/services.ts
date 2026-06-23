import { createPrismaClient, type PrismaClient } from "@repo/db";
import {
  createToken,
  ServiceCollection,
  type ServiceScope,
} from "@repo/dependency-injection";
import type { AuthProvider } from "@/app/features/auth/auth-provider";
import { MockAuthProvider } from "@/app/features/auth/mock-auth.provider";
import { SupabaseAuthProvider } from "@/app/features/auth/supabase-auth.provider";
import { HealthCheckController } from "@/app/features/health-check/health-check.controller";
import { HealthCheckFacade } from "@/app/features/health-check/health-check.facade";
import { HealthCheckService } from "@/app/features/health-check/health-check.service";
import { ListIngredientsController } from "@/app/features/ingredients/list-ingredients/list-ingredients.controller";
import { ListIngredientsFacade } from "@/app/features/ingredients/list-ingredients/list-ingredients.facade";
import { ListIngredientsRepository } from "@/app/features/ingredients/list-ingredients/list-ingredients.repository";
import { ListIngredientsService } from "@/app/features/ingredients/list-ingredients/list-ingredients.service";
import { GetProfileController } from "@/app/features/profiles/get-profile/get-profile.controller";
import { GetProfileFacade } from "@/app/features/profiles/get-profile/get-profile.facade";
import { GetProfileRepository } from "@/app/features/profiles/get-profile/get-profile.repository";
import { GetProfileService } from "@/app/features/profiles/get-profile/get-profile.service";
import { CreateRecipeController } from "@/app/features/recipes/create-recipe/create-recipe.controller";
import { CreateRecipeFacade } from "@/app/features/recipes/create-recipe/create-recipe.facade";
import { CreateRecipeRepository } from "@/app/features/recipes/create-recipe/create-recipe.repository";
import { CreateRecipeService } from "@/app/features/recipes/create-recipe/create-recipe.service";
import { ListUnitsController } from "@/app/features/units/list-units/list-units.controller";
import { ListUnitsFacade } from "@/app/features/units/list-units/list-units.facade";
import { ListUnitsRepository } from "@/app/features/units/list-units/list-units.repository";
import { ListUnitsService } from "@/app/features/units/list-units/list-units.service";

export const SERVICE_TOKENS = {
  prisma: createToken<PrismaClient>("prisma"),
  authProvider: createToken<AuthProvider>("authProvider"),
  healthCheckService: createToken<HealthCheckService>("healthCheckService"),
  healthCheckFacade: createToken<HealthCheckFacade>("healthCheckFacade"),
  healthCheckController: createToken<HealthCheckController>(
    "healthCheckController",
  ),
  listIngredientsRepository: createToken<ListIngredientsRepository>(
    "listIngredientsRepository",
  ),
  listIngredientsService: createToken<ListIngredientsService>(
    "listIngredientsService",
  ),
  listIngredientsFacade: createToken<ListIngredientsFacade>(
    "listIngredientsFacade",
  ),
  listIngredientsController: createToken<ListIngredientsController>(
    "listIngredientsController",
  ),
  listUnitsRepository: createToken<ListUnitsRepository>("listUnitsRepository"),
  listUnitsService: createToken<ListUnitsService>("listUnitsService"),
  listUnitsFacade: createToken<ListUnitsFacade>("listUnitsFacade"),
  listUnitsController: createToken<ListUnitsController>("listUnitsController"),
  getProfileRepository: createToken<GetProfileRepository>(
    "getProfileRepository",
  ),
  getProfileService: createToken<GetProfileService>("getProfileService"),
  getProfileFacade: createToken<GetProfileFacade>("getProfileFacade"),
  getProfileController: createToken<GetProfileController>(
    "getProfileController",
  ),
  createRecipeRepository: createToken<CreateRecipeRepository>(
    "createRecipeRepository",
  ),
  createRecipeService: createToken<CreateRecipeService>("createRecipeService"),
  createRecipeFacade: createToken<CreateRecipeFacade>("createRecipeFacade"),
  createRecipeController: createToken<CreateRecipeController>(
    "createRecipeController",
  ),
} as const;

const services = new ServiceCollection();

services.registerSingleton(SERVICE_TOKENS.prisma, () => {
  return createPrismaClient();
});

services.registerScoped(SERVICE_TOKENS.authProvider, () => {
  return process.env.AUTH_PROVIDER === "mock"
    ? new MockAuthProvider()
    : new SupabaseAuthProvider();
});

services.registerScoped(
  SERVICE_TOKENS.listIngredientsRepository,
  async (scope) => {
    return new ListIngredientsRepository(
      await scope.resolve(SERVICE_TOKENS.prisma),
    );
  },
);

services.registerScoped(SERVICE_TOKENS.healthCheckService, () => {
  return new HealthCheckService();
});

services.registerScoped(SERVICE_TOKENS.healthCheckFacade, async (scope) => {
  return new HealthCheckFacade(
    await scope.resolve(SERVICE_TOKENS.healthCheckService),
  );
});

services.registerScoped(SERVICE_TOKENS.healthCheckController, async (scope) => {
  return new HealthCheckController(
    await scope.resolve(SERVICE_TOKENS.healthCheckFacade),
  );
});

services.registerScoped(SERVICE_TOKENS.listIngredientsService, () => {
  return new ListIngredientsService();
});

services.registerScoped(SERVICE_TOKENS.listIngredientsFacade, async (scope) => {
  return new ListIngredientsFacade(
    await scope.resolve(SERVICE_TOKENS.listIngredientsService),
    await scope.resolve(SERVICE_TOKENS.listIngredientsRepository),
  );
});

services.registerScoped(
  SERVICE_TOKENS.listIngredientsController,
  async (scope) => {
    return new ListIngredientsController(
      await scope.resolve(SERVICE_TOKENS.listIngredientsFacade),
    );
  },
);

services.registerScoped(SERVICE_TOKENS.listUnitsRepository, async (scope) => {
  return new ListUnitsRepository(await scope.resolve(SERVICE_TOKENS.prisma));
});

services.registerScoped(SERVICE_TOKENS.listUnitsService, () => {
  return new ListUnitsService();
});

services.registerScoped(SERVICE_TOKENS.listUnitsFacade, async (scope) => {
  return new ListUnitsFacade(
    await scope.resolve(SERVICE_TOKENS.listUnitsService),
    await scope.resolve(SERVICE_TOKENS.listUnitsRepository),
  );
});

services.registerScoped(SERVICE_TOKENS.listUnitsController, async (scope) => {
  return new ListUnitsController(
    await scope.resolve(SERVICE_TOKENS.listUnitsFacade),
  );
});

services.registerScoped(SERVICE_TOKENS.getProfileRepository, async (scope) => {
  return new GetProfileRepository(await scope.resolve(SERVICE_TOKENS.prisma));
});

services.registerScoped(SERVICE_TOKENS.getProfileService, () => {
  return new GetProfileService();
});

services.registerScoped(SERVICE_TOKENS.getProfileFacade, async (scope) => {
  return new GetProfileFacade(
    await scope.resolve(SERVICE_TOKENS.getProfileService),
    await scope.resolve(SERVICE_TOKENS.getProfileRepository),
  );
});

services.registerScoped(SERVICE_TOKENS.getProfileController, async (scope) => {
  return new GetProfileController(
    await scope.resolve(SERVICE_TOKENS.authProvider),
    await scope.resolve(SERVICE_TOKENS.getProfileFacade),
  );
});

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

export function createServiceScope(): ServiceScope {
  return services.createScope();
}
