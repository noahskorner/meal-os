import { z } from "../../../lib/zod";
import { createValidationErrorResponseDtoSchema } from "../../error.dto";
import {
  createPaginatedResponseDtoSchema,
  type PaginatedResponseDto,
} from "../../paginated.dto";
import type { ListIngredientsResponse } from "./list-ingredients.response";

export const listIngredientResponseDtoSchema = z
  .object({
    id: z.uuid().openapi({
      example: "550e8400-e29b-41d4-a716-446655440000",
    }),
    name: z.string().openapi({
      example: "Bell Pepper",
    }),
    aliases: z.array(z.string()).openapi({
      example: ["Capsicum", "Sweet Pepper"],
    }),
    category: z.object({
      id: z.uuid().openapi({
        example: "550e8400-e29b-41d4-a716-446655440001",
      }),
      name: z.string().openapi({
        example: "Produce",
      }),
    }),
    defaultUnit: z.object({
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
    }),
  })
  .openapi("ListIngredientResponse");

export type ListIngredientResponseDto = z.infer<
  typeof listIngredientResponseDtoSchema
>;

export const listIngredientsResponseDtoSchema =
  createPaginatedResponseDtoSchema(
    listIngredientResponseDtoSchema,
    "ListIngredientsResponse",
  );

export type ListIngredientsResponseDto =
  PaginatedResponseDto<ListIngredientResponseDto>;

export const listIngredientsValidationErrorResponseDtoSchema =
  createValidationErrorResponseDtoSchema(
    "ListIngredientsValidationErrorResponse",
    "Invalid query parameters.",
    ["page: Too small: expected number to be >0"],
  );

export type ListIngredientsValidationErrorResponseDto = z.infer<
  typeof listIngredientsValidationErrorResponseDtoSchema
>;

export function createListIngredientsResponseDto(
  response: ListIngredientsResponse,
): ListIngredientsResponseDto {
  return listIngredientsResponseDtoSchema.parse(response);
}

export function createListIngredientsValidationErrorResponseDto(
  issues: string[],
): ListIngredientsValidationErrorResponseDto {
  return listIngredientsValidationErrorResponseDtoSchema.parse({
    message: "Invalid query parameters.",
    issues,
  });
}
