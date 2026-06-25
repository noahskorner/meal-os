import { z } from "../../../lib/zod";
import {
  createErrorResponseDtoSchema,
  createValidationErrorResponseDtoSchema,
} from "../../error.dto";
import type { GetRecipeResponse } from "./get-recipe.response";

const getRecipeIngredientReferenceResponseDtoSchema = z
  .object({
    id: z.uuid().openapi({
      example: "550e8400-e29b-41d4-a716-446655440001",
    }),
    name: z.string().openapi({
      example: "Garlic",
    }),
  })
  .openapi("GetRecipeIngredientReferenceResponse");

const getRecipeUserIngredientReferenceResponseDtoSchema = z
  .object({
    id: z.uuid().openapi({
      example: "550e8400-e29b-41d4-a716-446655440010",
    }),
    name: z.string().openapi({
      example: "Family Spice Blend",
    }),
  })
  .openapi("GetRecipeUserIngredientReferenceResponse");

const getRecipeIngredientResponseDtoSchema = z
  .object({
    id: z.uuid().openapi({
      example: "550e8400-e29b-41d4-a716-446655440000",
    }),
    ingredientId: z.uuid().nullable().openapi({
      example: "550e8400-e29b-41d4-a716-446655440001",
    }),
    userIngredientId: z.uuid().nullable().openapi({
      example: "550e8400-e29b-41d4-a716-446655440010",
    }),
    name: z.string().openapi({
      example: "Garlic",
    }),
    quantity: z.number().nullable().openapi({
      example: 2,
    }),
    unitId: z.uuid().nullable().openapi({
      example: "550e8400-e29b-41d4-a716-446655440002",
    }),
    preparation: z.string().nullable().openapi({
      example: "minced",
    }),
    note: z.string().nullable().openapi({
      example: "Adjust to taste.",
    }),
    isOptional: z.boolean().nullable().openapi({
      example: false,
    }),
    ingredient: getRecipeIngredientReferenceResponseDtoSchema.nullable(),
    userIngredient:
      getRecipeUserIngredientReferenceResponseDtoSchema.nullable(),
  })
  .openapi("GetRecipeIngredientResponse");

const getRecipeStepResponseDtoSchema = z
  .object({
    id: z.uuid().openapi({
      example: "550e8400-e29b-41d4-a716-446655440003",
    }),
    text: z.string().openapi({
      example: "Saute the garlic until fragrant.",
    }),
    sortOrder: z.number().int().openapi({
      example: 0,
    }),
  })
  .openapi("GetRecipeStepResponse");

export const getRecipeResponseDtoSchema = z
  .object({
    id: z.uuid().openapi({
      example: "550e8400-e29b-41d4-a716-446655440000",
    }),
    name: z.string().openapi({
      example: "Weeknight Pasta",
    }),
    description: z.string().nullable().openapi({
      example: "Simple pasta with garlic, olive oil, and chili flakes.",
    }),
    prepTimeMinutes: z.number().int().nullable().openapi({
      example: 10,
    }),
    cookTimeMinutes: z.number().int().nullable().openapi({
      example: 15,
    }),
    servings: z.number().int().nullable().openapi({
      example: 4,
    }),
    ingredients: z.array(getRecipeIngredientResponseDtoSchema),
    steps: z.array(getRecipeStepResponseDtoSchema),
  })
  .openapi("GetRecipeResponse");

export type GetRecipeResponseDto = z.infer<typeof getRecipeResponseDtoSchema>;

export const getRecipeUnauthorizedResponseDtoSchema =
  createErrorResponseDtoSchema(
    "GetRecipeUnauthorizedResponse",
    "Authentication required.",
  );

export type GetRecipeUnauthorizedResponseDto = z.infer<
  typeof getRecipeUnauthorizedResponseDtoSchema
>;

export const getRecipeNotFoundResponseDtoSchema = createErrorResponseDtoSchema(
  "GetRecipeNotFoundResponse",
  "Recipe not found.",
);

export type GetRecipeNotFoundResponseDto = z.infer<
  typeof getRecipeNotFoundResponseDtoSchema
>;

export const getRecipeValidationErrorResponseDtoSchema =
  createValidationErrorResponseDtoSchema(
    "GetRecipeValidationErrorResponse",
    "Invalid route parameters.",
    ["id: Invalid UUID"],
  );

export type GetRecipeValidationErrorResponseDto = z.infer<
  typeof getRecipeValidationErrorResponseDtoSchema
>;

export function createGetRecipeResponseDto(
  recipe: GetRecipeResponse,
): GetRecipeResponseDto {
  return getRecipeResponseDtoSchema.parse(recipe);
}

export function createGetRecipeUnauthorizedResponseDto(): GetRecipeUnauthorizedResponseDto {
  return getRecipeUnauthorizedResponseDtoSchema.parse({
    message: "Authentication required.",
  });
}

export function createGetRecipeNotFoundResponseDto(): GetRecipeNotFoundResponseDto {
  return getRecipeNotFoundResponseDtoSchema.parse({
    message: "Recipe not found.",
  });
}

export function createGetRecipeValidationErrorResponseDto(
  issues: string[],
): GetRecipeValidationErrorResponseDto {
  return getRecipeValidationErrorResponseDtoSchema.parse({
    message: "Invalid route parameters.",
    issues,
  });
}
