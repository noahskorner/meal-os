import { z } from "../../../lib/zod";
import {
  createErrorResponseSchema,
  createValidationErrorResponseSchema,
} from "../../error.response";
import type { CreateRecipeModel } from "./create-recipe.model";

export const createRecipeResponseSchema = z
  .object({
    id: z.uuid().openapi({
      example: "550e8400-e29b-41d4-a716-446655440000",
    }),
    location: z.string().openapi({
      example: "/api/recipes/550e8400-e29b-41d4-a716-446655440000",
    }),
  })
  .openapi("CreateRecipeResponse");

export type CreateRecipeResponse = z.infer<typeof createRecipeResponseSchema>;

export const createRecipeUnauthorizedResponseSchema = createErrorResponseSchema(
  "CreateRecipeUnauthorizedResponse",
  "Authentication required.",
);

export type CreateRecipeUnauthorizedResponse = z.infer<
  typeof createRecipeUnauthorizedResponseSchema
>;

export const createRecipeValidationErrorResponseSchema =
  createValidationErrorResponseSchema(
    "CreateRecipeValidationErrorResponse",
    "Invalid request body.",
    ["name: Too small: expected string to have >=1 characters"],
  );

export type CreateRecipeValidationErrorResponse = z.infer<
  typeof createRecipeValidationErrorResponseSchema
>;

export function createCreateRecipeResponse(
  recipe: CreateRecipeModel,
  location: string,
): CreateRecipeResponse {
  return createRecipeResponseSchema.parse({
    id: recipe.id,
    location,
  });
}

export function createRecipeUnauthorizedResponse(): CreateRecipeUnauthorizedResponse {
  return createRecipeUnauthorizedResponseSchema.parse({
    message: "Authentication required.",
  });
}

export function createRecipeValidationErrorResponse(
  issues: string[],
): CreateRecipeValidationErrorResponse {
  return createRecipeValidationErrorResponseSchema.parse({
    message: "Invalid request body.",
    issues,
  });
}
