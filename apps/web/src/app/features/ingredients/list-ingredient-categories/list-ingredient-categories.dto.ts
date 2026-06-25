import { z } from "../../../lib/zod";
import type { ListIngredientCategoriesResponse } from "./list-ingredient-categories.response";

export const ingredientCategorySummaryDtoSchema = z
  .object({
    id: z.uuid().openapi({
      example: "550e8400-e29b-41d4-a716-446655440000",
    }),
    name: z.string().openapi({
      example: "Produce",
    }),
  })
  .openapi("IngredientCategorySummary");

export type IngredientCategorySummaryDto = z.infer<
  typeof ingredientCategorySummaryDtoSchema
>;

export const listIngredientCategoriesResponseDtoSchema = z
  .array(ingredientCategorySummaryDtoSchema)
  .openapi("ListIngredientCategoriesResponse");

export type ListIngredientCategoriesResponseDto = z.infer<
  typeof listIngredientCategoriesResponseDtoSchema
>;

export function createListIngredientCategoriesResponseDto(
  response: ListIngredientCategoriesResponse,
): ListIngredientCategoriesResponseDto {
  return listIngredientCategoriesResponseDtoSchema.parse(response);
}
