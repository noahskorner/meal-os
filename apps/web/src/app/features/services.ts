import { createPrismaClient } from "@repo/db";
import {
  ServiceCollection,
  type ServiceScope,
} from "@repo/dependency-injection";
import { MockAuthProvider } from "@/app/features/auth/mock-auth.provider";
import { SupabaseAuthProvider } from "@/app/features/auth/supabase-auth.provider";
import { registerHealthCheck } from "@/app/features/health-check/health-check.di";
import { registerListIngredients } from "@/app/features/ingredients/list-ingredients/list-ingredients.di";
import { registerGetProfile } from "@/app/features/profiles/get-profile/get-profile.di";
import { registerCreateRecipe } from "@/app/features/recipes/create-recipe/create-recipe.di";
import { registerListRecipes } from "@/app/features/recipes/list-recipes/list-recipes.di";
import { SERVICE_TOKENS } from "@/app/features/service-tokens";
import { registerListUnits } from "@/app/features/units/list-units/list-units.di";

export { SERVICE_TOKENS } from "@/app/features/service-tokens";

const services = new ServiceCollection();

services.registerSingleton(SERVICE_TOKENS.prisma, () => {
  return createPrismaClient();
});

services.registerScoped(SERVICE_TOKENS.authProvider, () => {
  return process.env.AUTH_PROVIDER === "mock"
    ? new MockAuthProvider()
    : new SupabaseAuthProvider();
});

registerHealthCheck(services);
registerListIngredients(services);
registerListUnits(services);
registerGetProfile(services);
registerCreateRecipe(services);
registerListRecipes(services);

export function createServiceScope(): ServiceScope {
  return services.createScope();
}
