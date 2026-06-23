import { z } from "../../../lib/zod";
import { createErrorResponseDtoSchema } from "../../error.dto";
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

export type ListRecipeResponseDto = z.infer<
  typeof listRecipeResponseDtoSchema
>;

export const listRecipesResponseDtoSchema = z
  .object({
    items: z.array(listRecipeResponseDtoSchema),
  })
  .openapi("ListRecipesResponse");

export type ListRecipesResponseDto = z.infer<
  typeof listRecipesResponseDtoSchema
>;

export const listRecipesUnauthorizedResponseDtoSchema =
  createErrorResponseDtoSchema(
    "ListRecipesUnauthorizedResponse",
    "Authentication required.",
  );

export type ListRecipesUnauthorizedResponseDto = z.infer<
  typeof listRecipesUnauthorizedResponseDtoSchema
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
