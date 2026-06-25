import { z } from "../../../lib/zod";

export const listIngredientCategoriesRequestSchema = z
  .object({})
  .openapi("ListIngredientCategoriesRequest");

export type ListIngredientCategoriesRequest = z.infer<
  typeof listIngredientCategoriesRequestSchema
>;
