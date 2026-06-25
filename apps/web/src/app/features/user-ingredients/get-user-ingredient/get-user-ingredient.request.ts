import { z } from "../../../lib/zod";

export const getUserIngredientRequestSchema = z
  .object({
    userIngredientId: z
      .string()
      .uuid()
      .openapi({
        description: "The user ingredient ID.",
        example: "550e8400-e29b-41d4-a716-446655440010",
        param: {
          description: "The user ingredient ID.",
        },
      }),
  })
  .openapi("GetUserIngredientRequest");

export type GetUserIngredientRequest = z.infer<
  typeof getUserIngredientRequestSchema
>;
