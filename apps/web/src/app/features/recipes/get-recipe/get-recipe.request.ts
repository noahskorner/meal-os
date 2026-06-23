import { z } from "../../../lib/zod";

export const getRecipeRequestSchema = z
  .object({
    id: z.string().uuid().openapi({
      description: "The recipe ID.",
      example: "550e8400-e29b-41d4-a716-446655440000",
      param: {
        description: "The recipe ID.",
      },
    }),
  })
  .openapi("GetRecipeRequest");

export type GetRecipeRequest = z.infer<typeof getRecipeRequestSchema>;
