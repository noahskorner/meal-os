import { z } from "../../../lib/zod";
import {
  createErrorResponseDtoSchema,
  createValidationErrorResponseDtoSchema,
} from "../../error.dto";
import type { CreateRecipeResponse } from "./create-recipe.response";

export const createRecipeResponseDtoSchema = z
  .object({
    id: z.uuid().openapi({
      example: "550e8400-e29b-41d4-a716-446655440000",
    }),
    location: z.string().openapi({
      example: "/api/recipes/550e8400-e29b-41d4-a716-446655440000",
    }),
  })
  .openapi("CreateRecipeResponse");

export type CreateRecipeResponseDto = z.infer<
  typeof createRecipeResponseDtoSchema
>;

export const createRecipeUnauthorizedResponseDtoSchema =
  createErrorResponseDtoSchema(
    "CreateRecipeUnauthorizedResponse",
    "Authentication required.",
  );

export type CreateRecipeUnauthorizedResponseDto = z.infer<
  typeof createRecipeUnauthorizedResponseDtoSchema
>;

export const createRecipeValidationErrorResponseDtoSchema =
  createValidationErrorResponseDtoSchema(
    "CreateRecipeValidationErrorResponse",
    "Invalid request body.",
    ["name: Too small: expected string to have >=1 characters"],
  );

export type CreateRecipeValidationErrorResponseDto = z.infer<
  typeof createRecipeValidationErrorResponseDtoSchema
>;

export function createCreateRecipeResponseDto(
  recipe: CreateRecipeResponse,
  location: string,
): CreateRecipeResponseDto {
  return createRecipeResponseDtoSchema.parse({
    id: recipe.id,
    location,
  });
}

export function createRecipeUnauthorizedResponseDto(): CreateRecipeUnauthorizedResponseDto {
  return createRecipeUnauthorizedResponseDtoSchema.parse({
    message: "Authentication required.",
  });
}

export function createRecipeValidationErrorResponseDto(
  issues: string[],
): CreateRecipeValidationErrorResponseDto {
  return createRecipeValidationErrorResponseDtoSchema.parse({
    message: "Invalid request body.",
    issues,
  });
}
