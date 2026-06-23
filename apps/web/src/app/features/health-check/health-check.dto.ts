import { z } from "../../lib/zod";

import type { HealthCheckResponse } from "./health-check.response";

export const healthCheckResponseDtoSchema = z
  .object({
    status: z.literal("ok").openapi({ example: "ok" }),
    service: z.literal("web").openapi({ example: "web" }),
    timestamp: z.string().datetime().optional().openapi({
      example: "2026-06-19T14:00:00.000Z",
    }),
  })
  .openapi("HealthCheckResponse");

export type HealthCheckResponseDto = z.infer<
  typeof healthCheckResponseDtoSchema
>;

export const healthCheckValidationErrorResponseDtoSchema = z
  .object({
    message: z.string().openapi({ example: "Invalid query parameters." }),
    issues: z.array(z.string()).openapi({
      example: [
        'includeTimestamp: Invalid option: expected one of "true"|"false"',
      ],
    }),
  })
  .openapi("HealthCheckValidationErrorResponse");

export type HealthCheckValidationErrorResponseDto = z.infer<
  typeof healthCheckValidationErrorResponseDtoSchema
>;

export function createHealthCheckResponseDto(
  response: HealthCheckResponse,
): HealthCheckResponseDto {
  return healthCheckResponseDtoSchema.parse(response);
}

export function createHealthCheckValidationErrorResponseDto(
  issues: string[],
): HealthCheckValidationErrorResponseDto {
  return healthCheckValidationErrorResponseDtoSchema.parse({
    message: "Invalid query parameters.",
    issues,
  });
}
