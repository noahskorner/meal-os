import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  healthCheckResponseDtoSchema,
  healthCheckValidationErrorResponseDtoSchema,
} from "./health-check.dto";
import { healthCheckRequestSchema } from "./health-check.request";

export function registerHealthCheckRoute(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "get",
    path: "/api/health-check",
    operationId: "healthCheck",
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
            schema: healthCheckResponseDtoSchema,
          },
        },
      },
      400: {
        description: "The request query parameters were invalid.",
        content: {
          "application/json": {
            schema: healthCheckValidationErrorResponseDtoSchema,
          },
        },
      },
    },
  });
}
