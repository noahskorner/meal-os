import { z } from "../lib/zod";

export const errorResponseDtoSchema = z
  .object({
    message: z.string(),
  })
  .openapi("ErrorResponse");

export type ErrorResponseDto = z.infer<typeof errorResponseDtoSchema>;

export const validationErrorResponseDtoSchema = z
  .object({
    message: z.string(),
    issues: z.array(z.string()),
  })
  .openapi("ValidationErrorResponse");

export type ValidationErrorResponseDto = z.infer<
  typeof validationErrorResponseDtoSchema
>;

export function createErrorResponseDtoSchema(
  schemaName: string,
  messageExample: string,
) {
  return errorResponseDtoSchema
    .extend({
      message: z.string().openapi({
        example: messageExample,
      }),
    })
    .openapi(schemaName);
}

export function createValidationErrorResponseDtoSchema(
  schemaName: string,
  messageExample: string,
  issuesExample: string[],
) {
  return validationErrorResponseDtoSchema
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
