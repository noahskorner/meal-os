import { z } from "../../../lib/zod";
import type { ListUnitsResponse } from "./list-units.response";

export const unitSummaryDtoSchema = z
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

export type UnitSummaryDto = z.infer<typeof unitSummaryDtoSchema>;

export const listUnitsResponseDtoSchema = z
  .array(unitSummaryDtoSchema)
  .openapi("ListUnitsResponse");

export type ListUnitsResponseDto = z.infer<typeof listUnitsResponseDtoSchema>;

export function createListUnitsResponseDto(
  response: ListUnitsResponse,
): ListUnitsResponseDto {
  return listUnitsResponseDtoSchema.parse(response);
}
