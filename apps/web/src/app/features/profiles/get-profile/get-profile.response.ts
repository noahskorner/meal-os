import { z } from "@/lib/zod";
import type { GetProfileModel } from "./get-profile.model";

export const getProfileResponseSchema = z
  .object({
    id: z.uuid().openapi({
      example: "550e8400-e29b-41d4-a716-446655440000",
    }),
  })
  .openapi("GetProfileResponse");

export type GetProfileResponse = z.infer<typeof getProfileResponseSchema>;

export const getProfileUnauthorizedResponseSchema = z
  .object({
    message: z.string().openapi({ example: "Authentication required." }),
  })
  .openapi("GetProfileUnauthorizedResponse");

export type GetProfileUnauthorizedResponse = z.infer<
  typeof getProfileUnauthorizedResponseSchema
>;

export const getProfileForbiddenResponseSchema = z
  .object({
    message: z.string().openapi({
      example: "You can only access your own profile.",
    }),
  })
  .openapi("GetProfileForbiddenResponse");

export type GetProfileForbiddenResponse = z.infer<
  typeof getProfileForbiddenResponseSchema
>;

export const getProfileNotFoundResponseSchema = z
  .object({
    message: z.string().openapi({ example: "Profile not found." }),
  })
  .openapi("GetProfileNotFoundResponse");

export type GetProfileNotFoundResponse = z.infer<
  typeof getProfileNotFoundResponseSchema
>;

export const getProfileValidationErrorResponseSchema = z
  .object({
    message: z.string().openapi({ example: "Invalid route parameters." }),
    issues: z.array(z.string()).openapi({
      example: ["id: Invalid UUID"],
    }),
  })
  .openapi("GetProfileValidationErrorResponse");

export type GetProfileValidationErrorResponse = z.infer<
  typeof getProfileValidationErrorResponseSchema
>;

export function createProfileResponse(
  profile: GetProfileModel,
): GetProfileResponse {
  return getProfileResponseSchema.parse({
    id: profile.id,
  });
}

export function createProfileUnauthorizedResponse(): GetProfileUnauthorizedResponse {
  return getProfileUnauthorizedResponseSchema.parse({
    message: "Authentication required.",
  });
}

export function createProfileForbiddenResponse(): GetProfileForbiddenResponse {
  return getProfileForbiddenResponseSchema.parse({
    message: "You can only access your own profile.",
  });
}

export function createProfileNotFoundResponse(
  id: string,
): GetProfileNotFoundResponse {
  return getProfileNotFoundResponseSchema.parse({
    message: `Profile not found: ${id}.`,
  });
}

export function createProfileValidationErrorResponse(
  issues: string[],
): GetProfileValidationErrorResponse {
  return getProfileValidationErrorResponseSchema.parse({
    message: "Invalid route parameters.",
    issues,
  });
}
