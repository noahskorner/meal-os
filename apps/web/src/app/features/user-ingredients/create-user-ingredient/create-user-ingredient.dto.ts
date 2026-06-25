import { z } from "../../../lib/zod";
import {
  createErrorResponseDtoSchema,
  createValidationErrorResponseDtoSchema,
} from "../../error.dto";
import type { CreateUserIngredientResponse } from "./create-user-ingredient.response";

export const createUserIngredientResponseDtoSchema = z
  .object({
    id: z.uuid().openapi({
      example: "550e8400-e29b-41d4-a716-446655440010",
    }),
    location: z.string().openapi({
      example: "/api/user-ingredients/550e8400-e29b-41d4-a716-446655440010",
    }),
  })
  .openapi("CreateUserIngredientResponse");

export type CreateUserIngredientResponseDto = z.infer<
  typeof createUserIngredientResponseDtoSchema
>;

export const createUserIngredientUnauthorizedResponseDtoSchema =
  createErrorResponseDtoSchema(
    "CreateUserIngredientUnauthorizedResponse",
    "Authentication required.",
  );

export type CreateUserIngredientUnauthorizedResponseDto = z.infer<
  typeof createUserIngredientUnauthorizedResponseDtoSchema
>;

export const createUserIngredientValidationErrorResponseDtoSchema =
  createValidationErrorResponseDtoSchema(
    "CreateUserIngredientValidationErrorResponse",
    "Invalid request body.",
    ["name: Too small: expected string to have >=1 characters"],
  );

export type CreateUserIngredientValidationErrorResponseDto = z.infer<
  typeof createUserIngredientValidationErrorResponseDtoSchema
>;

export function createCreateUserIngredientResponseDto(
  userIngredient: CreateUserIngredientResponse,
  location: string,
): CreateUserIngredientResponseDto {
  return createUserIngredientResponseDtoSchema.parse({
    id: userIngredient.id,
    location,
  });
}

export function createUserIngredientUnauthorizedResponseDto(): CreateUserIngredientUnauthorizedResponseDto {
  return createUserIngredientUnauthorizedResponseDtoSchema.parse({
    message: "Authentication required.",
  });
}

export function createUserIngredientValidationErrorResponseDto(
  issues: string[],
): CreateUserIngredientValidationErrorResponseDto {
  return createUserIngredientValidationErrorResponseDtoSchema.parse({
    message: "Invalid request body.",
    issues,
  });
}
