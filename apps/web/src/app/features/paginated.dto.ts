import type { ZodType } from "zod";
import { z } from "../lib/zod";

export const paginationMetaDtoSchema = z
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

export type PaginationMetaDto = z.infer<typeof paginationMetaDtoSchema>;

export function createPaginatedResponseDtoSchema<TItemSchema extends ZodType>(
  itemSchema: TItemSchema,
  schemaName: string,
) {
  return z
    .object({
      items: z.array(itemSchema),
      page: paginationMetaDtoSchema.shape.page,
      pageSize: paginationMetaDtoSchema.shape.pageSize,
      totalItems: paginationMetaDtoSchema.shape.totalItems,
      totalPages: paginationMetaDtoSchema.shape.totalPages,
    })
    .openapi(schemaName);
}

export type PaginatedResponseDto<TItem> = {
  items: TItem[];
} & PaginationMetaDto;
