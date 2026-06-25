import { z } from "../../../lib/zod";
import {
  createErrorResponseDtoSchema,
  createValidationErrorResponseDtoSchema,
} from "../../error.dto";
import type { GetUserIngredientResponse } from "./get-user-ingredient.response";

const getUserIngredientCategoryResponseDtoSchema = z
  .object({
    id: z.uuid().openapi({
      example: "550e8400-e29b-41d4-a716-446655440001",
    }),
    name: z.string().openapi({
      example: "Produce",
    }),
  })
  .openapi("GetUserIngredientCategoryResponse");

const getUserIngredientUnitResponseDtoSchema = z
  .object({
    id: z.uuid().openapi({
      example: "550e8400-e29b-41d4-a716-446655440002",
    }),
    name: z.string().openapi({
      example: "each",
    }),
    abbreviation: z.string().openapi({
      example: "ea",
    }),
    type: z.string().openapi({
      example: "COUNT",
    }),
  })
  .openapi("GetUserIngredientUnitResponse");

export const getUserIngredientResponseDtoSchema = z
  .object({
    id: z.uuid().openapi({
      example: "550e8400-e29b-41d4-a716-446655440010",
    }),
    name: z.string().openapi({
      example: "Family Spice Blend",
    }),
    categoryId: z.uuid().nullable().openapi({
      example: "550e8400-e29b-41d4-a716-446655440001",
    }),
    defaultUnitId: z.uuid().nullable().openapi({
      example: "550e8400-e29b-41d4-a716-446655440002",
    }),
    category: getUserIngredientCategoryResponseDtoSchema.nullable(),
    defaultUnit: getUserIngredientUnitResponseDtoSchema.nullable(),
  })
  .openapi("GetUserIngredientResponse");

export type GetUserIngredientResponseDto = z.infer<
  typeof getUserIngredientResponseDtoSchema
>;

export const getUserIngredientUnauthorizedResponseDtoSchema =
  createErrorResponseDtoSchema(
    "GetUserIngredientUnauthorizedResponse",
    "Authentication required.",
  );

export type GetUserIngredientUnauthorizedResponseDto = z.infer<
  typeof getUserIngredientUnauthorizedResponseDtoSchema
>;

export const getUserIngredientNotFoundResponseDtoSchema =
  createErrorResponseDtoSchema(
    "GetUserIngredientNotFoundResponse",
    "User ingredient not found.",
  );

export type GetUserIngredientNotFoundResponseDto = z.infer<
  typeof getUserIngredientNotFoundResponseDtoSchema
>;

export const getUserIngredientValidationErrorResponseDtoSchema =
  createValidationErrorResponseDtoSchema(
    "GetUserIngredientValidationErrorResponse",
    "Invalid route parameters.",
    ["userIngredientId: Invalid UUID"],
  );

export type GetUserIngredientValidationErrorResponseDto = z.infer<
  typeof getUserIngredientValidationErrorResponseDtoSchema
>;

export function createGetUserIngredientResponseDto(
  userIngredient: GetUserIngredientResponse,
): GetUserIngredientResponseDto {
  return getUserIngredientResponseDtoSchema.parse(userIngredient);
}

export function createGetUserIngredientUnauthorizedResponseDto(): GetUserIngredientUnauthorizedResponseDto {
  return getUserIngredientUnauthorizedResponseDtoSchema.parse({
    message: "Authentication required.",
  });
}

export function createGetUserIngredientNotFoundResponseDto(): GetUserIngredientNotFoundResponseDto {
  return getUserIngredientNotFoundResponseDtoSchema.parse({
    message: "User ingredient not found.",
  });
}

export function createGetUserIngredientValidationErrorResponseDto(
  issues: string[],
): GetUserIngredientValidationErrorResponseDto {
  return getUserIngredientValidationErrorResponseDtoSchema.parse({
    message: "Invalid route parameters.",
    issues,
  });
}
