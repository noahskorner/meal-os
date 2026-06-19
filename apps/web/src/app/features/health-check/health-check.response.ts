import { z } from "@/lib/zod";

export const healthCheckResponseSchema = z
  .object({
    status: z.literal("ok").openapi({ example: "ok" }),
    service: z.literal("web").openapi({ example: "web" }),
    timestamp: z.string().datetime().optional().openapi({
      example: "2026-06-19T14:00:00.000Z",
    }),
  })
  .openapi("HealthCheckResponse");

export type HealthCheckResponse = z.infer<typeof healthCheckResponseSchema>;

export const healthCheckValidationErrorResponseSchema = z
  .object({
    message: z.string().openapi({ example: "Invalid query parameters." }),
    issues: z.array(z.string()).openapi({
      example: [
        'includeTimestamp: Invalid option: expected one of "true"|"false"',
      ],
    }),
  })
  .openapi("HealthCheckValidationErrorResponse");

export type HealthCheckValidationErrorResponse = z.infer<
  typeof healthCheckValidationErrorResponseSchema
>;
