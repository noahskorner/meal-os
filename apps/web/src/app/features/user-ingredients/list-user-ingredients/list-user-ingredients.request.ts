import { z } from "../../../lib/zod";

const positiveInteger = z.coerce.number().int().positive();

export const listUserIngredientsQueryRequestSchema = z
  .object({
    searchTerm: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .optional()
      .openapi({
        description:
          "A fuzzy, case-insensitive search across user ingredient names.",
        example: "famly spce blnd",
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
        description: "The number of user ingredients to return per page.",
        example: 20,
        param: {
          name: "pageSize",
          in: "query",
        },
      }),
  })
  .openapi("ListUserIngredientsRequest");

export type ListUserIngredientsQueryRequest = z.infer<
  typeof listUserIngredientsQueryRequestSchema
>;

export type ListUserIngredientsRequest = ListUserIngredientsQueryRequest & {
  createdById: string;
};
