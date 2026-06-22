import { z } from "../../../lib/zod";

export const listUnitsRequestSchema = z.object({}).openapi("ListUnitsRequest");

export type ListUnitsRequest = z.infer<typeof listUnitsRequestSchema>;
