import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { registerHealthCheckRoute } from "../health-check/health-check.route";
import { registerListIngredientsRoute } from "../ingredients/list-ingredients/list-ingredients.route";
import { registerGetProfileRoute } from "../profiles/get-profile/get-profile.route";

const routeRegistrations = [
  registerHealthCheckRoute,
  registerListIngredientsRoute,
  registerGetProfileRoute,
];

export function registerApiRoutes(registry: OpenAPIRegistry) {
  routeRegistrations.forEach((registerRoute) => registerRoute(registry));
}
