import { z } from "../../../lib/zod";
import {
  createErrorResponseDtoSchema,
  createValidationErrorResponseDtoSchema,
} from "../../error.dto";
import {
  createPaginatedResponseDtoSchema,
  type PaginatedResponseDto,
} from "../../paginated.dto";
import type { ListUserIngredientsResponse } from "./list-user-ingredients.response";

const listUserIngredientCategoryResponseDtoSchema = z
  .object({
    id: z.uuid().openapi({
      example: "550e8400-e29b-41d4-a716-446655440001",
    }),
    name: z.string().openapi({
      example: "Produce",
    }),
  })
  .openapi("ListUserIngredientCategoryResponse");

const listUserIngredientUnitResponseDtoSchema = z
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
  .openapi("ListUserIngredientUnitResponse");

export const listUserIngredientResponseDtoSchema = z
  .object({
    id: z.uuid().openapi({
      example: "550e8400-e29b-41d4-a716-446655440010",
    }),
    name: z.string().openapi({
      example: "Family Spice Blend",
    }),
    category: listUserIngredientCategoryResponseDtoSchema.nullable(),
    defaultUnit: listUserIngredientUnitResponseDtoSchema.nullable(),
  })
  .openapi("ListUserIngredientResponse");

export type ListUserIngredientResponseDto = z.infer<
  typeof listUserIngredientResponseDtoSchema
>;

export const listUserIngredientsResponseDtoSchema =
  createPaginatedResponseDtoSchema(
    listUserIngredientResponseDtoSchema,
    "ListUserIngredientsResponse",
  );

export type ListUserIngredientsResponseDto =
  PaginatedResponseDto<ListUserIngredientResponseDto>;

export const listUserIngredientsUnauthorizedResponseDtoSchema =
  createErrorResponseDtoSchema(
    "ListUserIngredientsUnauthorizedResponse",
    "Authentication required.",
  );

export type ListUserIngredientsUnauthorizedResponseDto = z.infer<
  typeof listUserIngredientsUnauthorizedResponseDtoSchema
>;

export const listUserIngredientsValidationErrorResponseDtoSchema =
  createValidationErrorResponseDtoSchema(
    "ListUserIngredientsValidationErrorResponse",
    "Invalid query parameters.",
    ["page: Too small: expected number to be >0"],
  );

export type ListUserIngredientsValidationErrorResponseDto = z.infer<
  typeof listUserIngredientsValidationErrorResponseDtoSchema
>;

export function createListUserIngredientsResponseDto(
  response: ListUserIngredientsResponse,
): ListUserIngredientsResponseDto {
  return listUserIngredientsResponseDtoSchema.parse(response);
}

export function createListUserIngredientsUnauthorizedResponseDto(): ListUserIngredientsUnauthorizedResponseDto {
  return listUserIngredientsUnauthorizedResponseDtoSchema.parse({
    message: "Authentication required.",
  });
}

export function createListUserIngredientsValidationErrorResponseDto(
  issues: string[],
): ListUserIngredientsValidationErrorResponseDto {
  return listUserIngredientsValidationErrorResponseDtoSchema.parse({
    message: "Invalid query parameters.",
    issues,
  });
}
