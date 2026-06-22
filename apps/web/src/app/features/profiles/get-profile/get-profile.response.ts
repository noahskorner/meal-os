import { z } from "@/lib/zod";
import { createProfile } from "./get-profile.service";
import { GetProfileModel } from "./get-profile.model";

export const getProfileResponseSchema = z
  .object({
    id: z.uuid().openapi({
      example: "550e8400-e29b-41d4-a716-446655440000",
    }),
  })
  .openapi("GetProfileResponse");

export type GetProfileResponse = z.infer<typeof getProfileResponseSchema>;

export const getProfileNotFoundResponseSchema = z
  .object({
    message: z.string().openapi({ example: "Profile not found." }),
  })
  .openapi("GetProfileNotFoundResponse");

export type GetProfileNotFoundResponse = z.infer<typeof getProfileNotFoundResponseSchema>;

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


export function createProfileResponse(profile: GetProfileModel): GetProfileResponse {
  return getProfileResponseSchema.parse(createProfile(profile));
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
