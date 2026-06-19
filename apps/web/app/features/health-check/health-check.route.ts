import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { healthCheckRequestSchema } from "./health-check.request";
import {
  healthCheckResponseSchema,
  healthCheckValidationErrorResponseSchema,
} from "./health-check.response";

export function registerHealthCheckRoute(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "get",
    path: "/api/health-check",
    tags: ["System"],
    summary: "Health check",
    description: "Returns the basic status of the web application.",
    request: {
      query: healthCheckRequestSchema,
    },
    responses: {
      200: {
        description: "The application is healthy.",
        content: {
          "application/json": {
            schema: healthCheckResponseSchema,
          },
        },
      },
      400: {
        description: "The request query parameters were invalid.",
        content: {
          "application/json": {
            schema: healthCheckValidationErrorResponseSchema,
          },
        },
      },
    },
  });
}
