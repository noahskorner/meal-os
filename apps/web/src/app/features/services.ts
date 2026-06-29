import { createPrismaClient } from "@repo/db";
import {
  ServiceCollection,
  type ServiceScope,
} from "@repo/dependency-injection";
import { MockAuthProvider } from "@/app/features/auth/mock-auth.provider";
import { SupabaseAuthProvider } from "@/app/features/auth/supabase-auth.provider";
import { registerHealthCheck } from "@/app/features/health-check/health-check.di";
import { registerListIngredientCategories } from "@/app/features/ingredients/list-ingredient-categories/list-ingredient-categories.di";
import { registerListIngredients } from "@/app/features/ingredients/list-ingredients/list-ingredients.di";
import { registerCreateMealPlan } from "@/app/features/meal-plans/create-meal-plan/create-meal-plan.di";
import { registerGetProfile } from "@/app/features/profiles/get-profile/get-profile.di";
import { registerCreateRecipe } from "@/app/features/recipes/create-recipe/create-recipe.di";
import { registerListRecipes } from "@/app/features/recipes/list-recipes/list-recipes.di";
import { registerGetRecipe } from "@/app/features/recipes/get-recipe/get-recipe.di";
import { registerUpdateRecipe } from "@/app/features/recipes/update-recipe/update-recipe.di";
import { SERVICE_TOKENS } from "@/app/features/service-tokens";
import { registerCreateUserIngredient } from "@/app/features/user-ingredients/create-user-ingredient/create-user-ingredient.di";
import { registerGetUserIngredient } from "@/app/features/user-ingredients/get-user-ingredient/get-user-ingredient.di";
import { registerListUserIngredients } from "@/app/features/user-ingredients/list-user-ingredients/list-user-ingredients.di";
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
registerListIngredientCategories(services);
registerCreateMealPlan(services);
registerCreateUserIngredient(services);
registerListUserIngredients(services);
registerGetUserIngredient(services);
registerListUnits(services);
registerGetProfile(services);
registerCreateRecipe(services);
registerListRecipes(services);
registerGetRecipe(services);
registerUpdateRecipe(services);

export function createServiceScope(): ServiceScope {
  return services.createScope();
}
