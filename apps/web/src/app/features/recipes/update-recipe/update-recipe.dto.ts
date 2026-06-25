import { z } from "../../../lib/zod";
import {
  createErrorResponseDtoSchema,
  createValidationErrorResponseDtoSchema,
} from "../../error.dto";

export const updateRecipeUnauthorizedResponseDtoSchema =
  createErrorResponseDtoSchema(
    "UpdateRecipeUnauthorizedResponse",
    "Authentication required.",
  );

export type UpdateRecipeUnauthorizedResponseDto = z.infer<
  typeof updateRecipeUnauthorizedResponseDtoSchema
>;

export const updateRecipeNotFoundResponseDtoSchema =
  createErrorResponseDtoSchema(
    "UpdateRecipeNotFoundResponse",
    "Recipe not found.",
  );

export type UpdateRecipeNotFoundResponseDto = z.infer<
  typeof updateRecipeNotFoundResponseDtoSchema
>;

export const updateRecipeValidationErrorResponseDtoSchema =
  createValidationErrorResponseDtoSchema(
    "UpdateRecipeValidationErrorResponse",
    "Invalid recipe update request.",
    ["id: Invalid UUID"],
  );

export type UpdateRecipeValidationErrorResponseDto = z.infer<
  typeof updateRecipeValidationErrorResponseDtoSchema
>;

export function createUpdateRecipeUnauthorizedResponseDto(): UpdateRecipeUnauthorizedResponseDto {
  return updateRecipeUnauthorizedResponseDtoSchema.parse({
    message: "Authentication required.",
  });
}

export function createUpdateRecipeNotFoundResponseDto(): UpdateRecipeNotFoundResponseDto {
  return updateRecipeNotFoundResponseDtoSchema.parse({
    message: "Recipe not found.",
  });
}

export function createUpdateRecipeValidationErrorResponseDto(
  issues: string[],
): UpdateRecipeValidationErrorResponseDto {
  return updateRecipeValidationErrorResponseDtoSchema.parse({
    message: "Invalid recipe update request.",
    issues,
  });
}
