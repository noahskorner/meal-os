import { z } from "../../lib/zod";

export const healthCheckRequestSchema = z
  .object({
    includeTimestamp: z
      .enum(["true", "false"])
      .optional()
      .openapi({
        description: "Set to true to include a timestamp in the response.",
        example: "true",
        param: {
          description: "Set to true to include a timestamp in the response.",
        },
      }),
  })
  .openapi("HealthCheckRequest");

export type HealthCheckRequest = z.infer<typeof healthCheckRequestSchema>;
