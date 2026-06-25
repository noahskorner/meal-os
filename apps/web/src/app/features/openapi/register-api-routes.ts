import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { registerHealthCheckRoute } from "../health-check/health-check.route";
import { registerListIngredientsRoute } from "../ingredients/list-ingredients/list-ingredients.route";
import { registerGetProfileRoute } from "../profiles/get-profile/get-profile.route";
import { registerCreateRecipeRoute } from "../recipes/create-recipe/create-recipe.route";
import { registerListRecipesRoute } from "../recipes/list-recipes/list-recipes.route";
import { registerGetRecipeRoute } from "../recipes/get-recipe/get-recipe.route";
import { registerUpdateRecipeRoute } from "../recipes/update-recipe/update-recipe.route";
import { registerCreateUserIngredientRoute } from "../user-ingredients/create-user-ingredient/create-user-ingredient.route";
import { registerListUnitsRoute } from "../units/list-units/list-units.route";

const routeRegistrations = [
  registerHealthCheckRoute,
  registerListIngredientsRoute,
  registerGetProfileRoute,
  registerCreateUserIngredientRoute,
  registerCreateRecipeRoute,
  registerListRecipesRoute,
  registerGetRecipeRoute,
  registerUpdateRecipeRoute,
  registerListUnitsRoute,
];

export function registerApiRoutes(registry: OpenAPIRegistry) {
  routeRegistrations.forEach((registerRoute) => registerRoute(registry));
}
