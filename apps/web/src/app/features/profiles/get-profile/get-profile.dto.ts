import { z } from "../../../lib/zod";
import {
  createErrorResponseDtoSchema,
  createValidationErrorResponseDtoSchema,
} from "../../error.dto";
import type { GetProfileResponse } from "./get-profile.response";

export const getProfileResponseDtoSchema = z
  .object({
    id: z.uuid().openapi({
      example: "550e8400-e29b-41d4-a716-446655440000",
    }),
  })
  .openapi("GetProfileResponse");

export type GetProfileResponseDto = z.infer<typeof getProfileResponseDtoSchema>;

export const getProfileUnauthorizedResponseDtoSchema =
  createErrorResponseDtoSchema(
    "GetProfileUnauthorizedResponse",
    "Authentication required.",
  );

export type GetProfileUnauthorizedResponseDto = z.infer<
  typeof getProfileUnauthorizedResponseDtoSchema
>;

export const getProfileForbiddenResponseDtoSchema =
  createErrorResponseDtoSchema(
    "GetProfileForbiddenResponse",
    "You can only access your own profile.",
  );

export type GetProfileForbiddenResponseDto = z.infer<
  typeof getProfileForbiddenResponseDtoSchema
>;

export const getProfileNotFoundResponseDtoSchema = createErrorResponseDtoSchema(
  "GetProfileNotFoundResponse",
  "Profile not found.",
);

export type GetProfileNotFoundResponseDto = z.infer<
  typeof getProfileNotFoundResponseDtoSchema
>;

export const getProfileValidationErrorResponseDtoSchema =
  createValidationErrorResponseDtoSchema(
    "GetProfileValidationErrorResponse",
    "Invalid route parameters.",
    ["id: Invalid UUID"],
  );

export type GetProfileValidationErrorResponseDto = z.infer<
  typeof getProfileValidationErrorResponseDtoSchema
>;

export function createProfileResponseDto(
  profile: GetProfileResponse,
): GetProfileResponseDto {
  return getProfileResponseDtoSchema.parse({
    id: profile.id,
  });
}

export function createProfileUnauthorizedResponseDto(): GetProfileUnauthorizedResponseDto {
  return getProfileUnauthorizedResponseDtoSchema.parse({
    message: "Authentication required.",
  });
}

export function createProfileForbiddenResponseDto(): GetProfileForbiddenResponseDto {
  return getProfileForbiddenResponseDtoSchema.parse({
    message: "You can only access your own profile.",
  });
}

export function createProfileNotFoundResponseDto(
  id: string,
): GetProfileNotFoundResponseDto {
  return getProfileNotFoundResponseDtoSchema.parse({
    message: `Profile not found: ${id}.`,
  });
}

export function createProfileValidationErrorResponseDto(
  issues: string[],
): GetProfileValidationErrorResponseDto {
  return getProfileValidationErrorResponseDtoSchema.parse({
    message: "Invalid route parameters.",
    issues,
  });
}
