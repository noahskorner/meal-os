import { z } from "../../../lib/zod";

export const createUserIngredientRequestSchema = z
  .object({
    name: z.string().trim().min(1).max(200).openapi({
      example: "Family Spice Blend",
    }),
    categoryId: z.uuid().optional().openapi({
      example: "550e8400-e29b-41d4-a716-446655440001",
    }),
    defaultUnitId: z.uuid().optional().openapi({
      example: "550e8400-e29b-41d4-a716-446655440002",
    }),
  })
  .openapi("CreateUserIngredientRequest");

export type CreateUserIngredientRequest = z.infer<
  typeof createUserIngredientRequestSchema
>;
