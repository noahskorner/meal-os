import { z } from "../../../lib/zod";

const positiveInteger = z.coerce.number().int().positive();

export const listRecipesQueryRequestSchema = z
  .object({
    searchTerm: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .optional()
      .openapi({
        description: "A fuzzy, case-insensitive search across recipe names.",
        example: "chikn parm",
        param: {
          name: "searchTerm",
          in: "query",
        },
      }),
    page: positiveInteger.default(1).openapi({
      description: "The page number to return.",
      example: 1,
      param: {
        name: "page",
        in: "query",
      },
    }),
    pageSize: positiveInteger
      .max(100)
      .default(20)
      .openapi({
        description: "The number of recipes to return per page.",
        example: 20,
        param: {
          name: "pageSize",
          in: "query",
        },
      }),
  })
  .openapi("ListRecipesRequest");

export type ListRecipesQueryRequest = z.infer<
  typeof listRecipesQueryRequestSchema
>;

export type ListRecipesRequest = ListRecipesQueryRequest & {
  createdById: string;
};
