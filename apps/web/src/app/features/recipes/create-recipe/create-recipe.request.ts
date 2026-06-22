import { z } from "../../../lib/zod";

export const createRecipeRequestSchema = z
  .object({
    name: z.string().trim().min(1).max(200).openapi({
      example: "Weeknight Pasta",
    }),
    description: z.string().trim().min(1).max(5000).optional().openapi({
      example: "Simple pasta with garlic, olive oil, and chili flakes.",
    }),
    prepTimeMinutes: z.coerce.number().int().positive().max(1440).optional().openapi({
      example: 10,
    }),
    cookTimeMinutes: z.coerce.number().int().positive().max(1440).optional().openapi({
      example: 15,
    }),
    servings: z.coerce.number().int().positive().max(1000).optional().openapi({
      example: 4,
    }),
  })
  .openapi("CreateRecipeRequest");

export type CreateRecipeRequest = z.infer<typeof createRecipeRequestSchema>;
