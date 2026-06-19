import type { HealthCheckRequest } from "./health-check.request";
import {
  healthCheckResponseSchema,
  type HealthCheckValidationErrorResponse,
  healthCheckValidationErrorResponseSchema,
} from "./health-check.response";
import { createHealthCheck } from "./health-check.service";

export function getHealthCheck(request: HealthCheckRequest) {
  return healthCheckResponseSchema.parse(
    createHealthCheck(request.includeTimestamp === "true"),
  );
}

export function createHealthCheckValidationError(
  issues: string[],
): HealthCheckValidationErrorResponse {
  return healthCheckValidationErrorResponseSchema.parse({
    message: "Invalid query parameters.",
    issues,
  });
}
