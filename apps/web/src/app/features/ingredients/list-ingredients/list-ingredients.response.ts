import { z } from "../../../lib/zod";
import { createValidationErrorResponseSchema } from "../../error.response";
import {
  createPaginatedResponseSchema,
  type PaginatedResponse,
} from "../../paginated.response";
import type { ListIngredientsModel } from "./list-ingredients.model";

export const ingredientSummarySchema = z
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
  .openapi("IngredientSummary");

export type IngredientSummary = z.infer<typeof ingredientSummarySchema>;

export const listIngredientsResponseSchema = createPaginatedResponseSchema(
  ingredientSummarySchema,
  "ListIngredientsResponse",
);

export type ListIngredientsResponse = PaginatedResponse<IngredientSummary>;

export const listIngredientsValidationErrorResponseSchema =
  createValidationErrorResponseSchema(
    "ListIngredientsValidationErrorResponse",
    "Invalid query parameters.",
    ["page: Too small: expected number to be >0"],
  );

export type ListIngredientsValidationErrorResponse = z.infer<
  typeof listIngredientsValidationErrorResponseSchema
>;

export function createListIngredientsResponse(
  response: PaginatedResponse<ListIngredientsModel>,
): ListIngredientsResponse {
  return listIngredientsResponseSchema.parse(response);
}

export function createListIngredientsValidationErrorResponse(
  issues: string[],
): ListIngredientsValidationErrorResponse {
  return listIngredientsValidationErrorResponseSchema.parse({
    message: "Invalid query parameters.",
    issues,
  });
}
