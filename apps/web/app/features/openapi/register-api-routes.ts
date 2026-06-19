import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { registerHealthCheckRoute } from "../health-check/health-check.route";

const routeRegistrations = [registerHealthCheckRoute];

export function registerApiRoutes(registry: OpenAPIRegistry) {
  routeRegistrations.forEach((registerRoute) => registerRoute(registry));
}
