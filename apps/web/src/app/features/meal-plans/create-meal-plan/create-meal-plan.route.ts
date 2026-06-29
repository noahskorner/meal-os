import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  createMealPlanResponseDtoSchema,
  createMealPlanUnauthorizedResponseDtoSchema,
  createMealPlanValidationErrorResponseDtoSchema,
} from "./create-meal-plan.dto";
import { createMealPlanRequestSchema } from "./create-meal-plan.request";

export function registerCreateMealPlanRoute(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "post",
    path: "/api/meal-plans",
    operationId: "createMealPlan",
    tags: ["Meal Plans"],
    summary: "Create meal plan",
    description: "Creates a meal plan for the authenticated user.",
    request: {
      body: {
        required: true,
        content: {
          "application/json": {
            schema: createMealPlanRequestSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "The meal plan was created.",
        headers: {
          Location: {
            description: "Location of the created meal plan resource.",
            schema: {
              type: "string",
            },
          },
        },
        content: {
          "application/json": {
            schema: createMealPlanResponseDtoSchema,
          },
        },
      },
      400: {
        description: "The request body was invalid.",
        content: {
          "application/json": {
            schema: createMealPlanValidationErrorResponseDtoSchema,
          },
        },
      },
      401: {
        description: "The request was unauthenticated.",
        content: {
          "application/json": {
            schema: createMealPlanUnauthorizedResponseDtoSchema,
          },
        },
      },
    },
  });
}
