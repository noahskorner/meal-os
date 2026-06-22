import { z } from "../lib/zod";

export const errorResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi("ErrorResponse");

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export const validationErrorResponseSchema = z
  .object({
    message: z.string(),
    issues: z.array(z.string()),
  })
  .openapi("ValidationErrorResponse");

export type ValidationErrorResponse = z.infer<
  typeof validationErrorResponseSchema
>;

export function createErrorResponseSchema(
  schemaName: string,
  messageExample: string,
) {
  return errorResponseSchema.extend({
    message: z.string().openapi({
      example: messageExample,
    }),
  }).openapi(schemaName);
}

export function createValidationErrorResponseSchema(
  schemaName: string,
  messageExample: string,
  issuesExample: string[],
) {
  return validationErrorResponseSchema
    .extend({
      message: z.string().openapi({
        example: messageExample,
      }),
      issues: z.array(z.string()).openapi({
        example: issuesExample,
      }),
    })
    .openapi(schemaName);
}
