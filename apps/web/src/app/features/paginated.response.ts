import type { ZodType } from "zod";
import { z } from "../lib/zod";

export const paginationMetaSchema = z
  .object({
    page: z.number().int().positive().openapi({
      example: 1,
    }),
    pageSize: z.number().int().positive().openapi({
      example: 20,
    }),
    totalItems: z.number().int().nonnegative().openapi({
      example: 120,
    }),
    totalPages: z.number().int().nonnegative().openapi({
      example: 6,
    }),
  })
  .openapi("PaginationMeta");

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

export function createPaginatedResponseSchema<TItemSchema extends ZodType>(
  itemSchema: TItemSchema,
  schemaName: string,
) {
  return z
    .object({
      items: z.array(itemSchema),
      page: paginationMetaSchema.shape.page,
      pageSize: paginationMetaSchema.shape.pageSize,
      totalItems: paginationMetaSchema.shape.totalItems,
      totalPages: paginationMetaSchema.shape.totalPages,
    })
    .openapi(schemaName);
}

export type PaginatedResponse<TItem> = {
  items: TItem[];
} & PaginationMeta;
