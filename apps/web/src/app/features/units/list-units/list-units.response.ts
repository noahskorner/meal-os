import { z } from "../../../lib/zod";
import type { ListUnitsModel } from "./list-units.model";

export const unitSummarySchema = z
  .object({
    id: z.uuid().openapi({
      example: "550e8400-e29b-41d4-a716-446655440000",
    }),
    name: z.string().openapi({
      example: "cup",
    }),
    abbreviation: z.string().openapi({
      example: "cup",
    }),
    type: z.string().openapi({
      example: "VOLUME",
    }),
  })
  .openapi("UnitSummary");

export type UnitSummary = z.infer<typeof unitSummarySchema>;

export const listUnitsResponseSchema = z
  .array(unitSummarySchema)
  .openapi("ListUnitsResponse");

export type ListUnitsResponse = z.infer<typeof listUnitsResponseSchema>;

export function createListUnitsResponse(
  response: ListUnitsModel[],
): ListUnitsResponse {
  return listUnitsResponseSchema.parse(response);
}
