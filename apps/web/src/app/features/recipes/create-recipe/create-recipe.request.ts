import { z } from "../../../lib/zod";

const createRecipeIngredientRequestSchema = z
  .object({
    ingredientId: z.uuid().openapi({
      example: "550e8400-e29b-41d4-a716-446655440000",
    }),
    name: z.string().trim().min(1).max(200).openapi({
      example: "Garlic",
    }),
    quantity: z.coerce.number().positive().max(99999999.99).optional().openapi({
      example: 2,
    }),
    unitId: z.uuid().optional().openapi({
      example: "550e8400-e29b-41d4-a716-446655440001",
    }),
    preparation: z.string().trim().min(1).max(5000).optional().openapi({
      example: "minced",
    }),
    note: z.string().trim().min(1).max(5000).optional().openapi({
      example: "Adjust to taste.",
    }),
    isOptional: z.boolean().optional().openapi({
      example: false,
    }),
  })
  .openapi("CreateRecipeIngredientRequest");

const createRecipeStepRequestSchema = z
  .object({
    ingredientId: z.uuid().optional().openapi({
      example: "550e8400-e29b-41d4-a716-446655440000",
    }),
    text: z.string().trim().min(1).max(10000).openapi({
      example: "Saute the garlic until fragrant.",
    }),
    sortOrder: z.coerce.number().int().min(0).max(1000).openapi({
      example: 0,
    }),
  })
  .openapi("CreateRecipeStepRequest");

export const createRecipeRequestSchema = z
  .object({
    name: z.string().trim().min(1).max(200).openapi({
      example: "Weeknight Pasta",
    }),
    description: z.string().trim().min(0).max(5000).optional().openapi({
      example: "Simple pasta with garlic, olive oil, and chili flakes.",
    }),
    prepTimeMinutes: z.coerce
      .number()
      .int()
      .positive()
      .max(1440)
      .optional()
      .openapi({
        example: 10,
      }),
    cookTimeMinutes: z.coerce
      .number()
      .int()
      .positive()
      .max(1440)
      .optional()
      .openapi({
        example: 15,
      }),
    servings: z.coerce.number().int().positive().max(1000).optional().openapi({
      example: 4,
    }),
    recipeIngredients: z
      .array(createRecipeIngredientRequestSchema)
      .optional()
      .openapi({
        example: [
          {
            ingredientId: "550e8400-e29b-41d4-a716-446655440000",
            name: "Garlic",
            quantity: 2,
            unitId: "550e8400-e29b-41d4-a716-446655440001",
            preparation: "minced",
            isOptional: false,
          },
        ],
      }),
    recipeSteps: z
      .array(createRecipeStepRequestSchema)
      .optional()
      .openapi({
        example: [
          {
            text: "Saute the garlic until fragrant.",
            sortOrder: 0,
          },
        ],
      }),
  })
  .openapi("CreateRecipeRequest");

export type CreateRecipeRequest = z.infer<typeof createRecipeRequestSchema>;
