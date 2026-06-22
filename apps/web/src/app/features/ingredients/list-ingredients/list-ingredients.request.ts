import { z } from "../../../lib/zod";

const positiveInteger = z.coerce.number().int().positive();

export const listIngredientsRequestSchema = z
  .object({
    page: positiveInteger.default(1).openapi({
      description: "The page number to return.",
      example: 1,
      param: {
        name: "page",
        in: "query",
      },
    }),
    pageSize: positiveInteger.max(100).default(20).openapi({
      description: "The number of ingredients to return per page.",
      example: 20,
      param: {
        name: "pageSize",
        in: "query",
      },
    }),
  })
  .openapi("ListIngredientsRequest");

export type ListIngredientsRequest = z.infer<typeof listIngredientsRequestSchema>;
