import { z } from "../../../lib/zod";
import {
  createErrorResponseDtoSchema,
  createValidationErrorResponseDtoSchema,
} from "../../error.dto";
import type { CreateMealPlanResponse } from "./create-meal-plan.response";

export const createMealPlanResponseDtoSchema = z
  .object({
    id: z.uuid().openapi({
      example: "550e8400-e29b-41d4-a716-446655440000",
    }),
    location: z.string().openapi({
      example: "/api/meal-plans/550e8400-e29b-41d4-a716-446655440000",
    }),
  })
  .openapi("CreateMealPlanResponse");

export type CreateMealPlanResponseDto = z.infer<
  typeof createMealPlanResponseDtoSchema
>;

export const createMealPlanUnauthorizedResponseDtoSchema =
  createErrorResponseDtoSchema(
    "CreateMealPlanUnauthorizedResponse",
    "Authentication required.",
  );

export type CreateMealPlanUnauthorizedResponseDto = z.infer<
  typeof createMealPlanUnauthorizedResponseDtoSchema
>;

export const createMealPlanValidationErrorResponseDtoSchema =
  createValidationErrorResponseDtoSchema(
    "CreateMealPlanValidationErrorResponse",
    "Invalid request body.",
    ["entries.0.date: Each meal plan entry date must be unique."],
  );

export type CreateMealPlanValidationErrorResponseDto = z.infer<
  typeof createMealPlanValidationErrorResponseDtoSchema
>;

export function createCreateMealPlanResponseDto(
  mealPlan: CreateMealPlanResponse,
  location: string,
): CreateMealPlanResponseDto {
  return createMealPlanResponseDtoSchema.parse({
    id: mealPlan.id,
    location,
  });
}

export function createMealPlanUnauthorizedResponseDto(): CreateMealPlanUnauthorizedResponseDto {
  return createMealPlanUnauthorizedResponseDtoSchema.parse({
    message: "Authentication required.",
  });
}

export function createMealPlanValidationErrorResponseDto(
  issues: string[],
): CreateMealPlanValidationErrorResponseDto {
  return createMealPlanValidationErrorResponseDtoSchema.parse({
    message: "Invalid request body.",
    issues,
  });
}
