import { z } from "../../../lib/zod";
import {
  createErrorResponseDtoSchema,
  createValidationErrorResponseDtoSchema,
} from "../../error.dto";
import {
  createPaginatedResponseDtoSchema,
  type PaginatedResponseDto,
} from "../../paginated.dto";
import type { ListRecipesResponse } from "./list-recipes.response";

export const listRecipeResponseDtoSchema = z
  .object({
    id: z.uuid().openapi({
      example: "550e8400-e29b-41d4-a716-446655440000",
    }),
    name: z.string().openapi({
      example: "Weeknight Pasta",
    }),
    description: z.string().optional().openapi({
      example: "Simple pasta with garlic, olive oil, and chili flakes.",
    }),
    prepTimeMinutes: z.number().int().positive().optional().openapi({
      example: 10,
    }),
    cookTimeMinutes: z.number().int().positive().optional().openapi({
      example: 15,
    }),
    servings: z.number().int().positive().optional().openapi({
      example: 4,
    }),
  })
  .openapi("ListRecipeResponse");

export type ListRecipeResponseDto = z.infer<typeof listRecipeResponseDtoSchema>;

export const listRecipesResponseDtoSchema = createPaginatedResponseDtoSchema(
  listRecipeResponseDtoSchema,
  "ListRecipesResponse",
);

export type ListRecipesResponseDto =
  PaginatedResponseDto<ListRecipeResponseDto>;

export const listRecipesUnauthorizedResponseDtoSchema =
  createErrorResponseDtoSchema(
    "ListRecipesUnauthorizedResponse",
    "Authentication required.",
  );

export type ListRecipesUnauthorizedResponseDto = z.infer<
  typeof listRecipesUnauthorizedResponseDtoSchema
>;

export const listRecipesValidationErrorResponseDtoSchema =
  createValidationErrorResponseDtoSchema(
    "ListRecipesValidationErrorResponse",
    "Invalid query parameters.",
    ["page: Too small: expected number to be >0"],
  );

export type ListRecipesValidationErrorResponseDto = z.infer<
  typeof listRecipesValidationErrorResponseDtoSchema
>;

export function createListRecipesResponseDto(
  response: ListRecipesResponse,
): ListRecipesResponseDto {
  return listRecipesResponseDtoSchema.parse(response);
}

export function createListRecipesUnauthorizedResponseDto(): ListRecipesUnauthorizedResponseDto {
  return listRecipesUnauthorizedResponseDtoSchema.parse({
    message: "Authentication required.",
  });
}

export function createListRecipesValidationErrorResponseDto(
  issues: string[],
): ListRecipesValidationErrorResponseDto {
  return listRecipesValidationErrorResponseDtoSchema.parse({
    message: "Invalid query parameters.",
    issues,
  });
}
