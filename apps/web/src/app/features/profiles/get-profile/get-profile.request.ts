import { z } from "../../../lib/zod";

export const getProfileRequestSchema = z
  .object({
    id: z.string().uuid().openapi({
      description: "The profile ID.",
      example: "550e8400-e29b-41d4-a716-446655440000",
      param: {
        description: "The profile ID.",
      },
    }),
  })
  .openapi("GetProfileRequest");

export type GetProfileRequest = z.infer<typeof getProfileRequestSchema>;
