import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  createUserIngredientResponseDtoSchema,
  createUserIngredientUnauthorizedResponseDtoSchema,
  createUserIngredientValidationErrorResponseDtoSchema,
} from "./create-user-ingredient.dto";
import { createUserIngredientRequestSchema } from "./create-user-ingredient.request";

export function registerCreateUserIngredientRoute(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "post",
    path: "/api/user-ingredients",
    operationId: "createUserIngredient",
    tags: ["User Ingredients"],
    summary: "Create user ingredient",
    description: "Creates a custom ingredient for the authenticated user.",
    request: {
      body: {
        required: true,
        content: {
          "application/json": {
            schema: createUserIngredientRequestSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "The user ingredient was created.",
        headers: {
          Location: {
            description: "Location of the created user ingredient resource.",
            schema: {
              type: "string",
            },
          },
        },
        content: {
          "application/json": {
            schema: createUserIngredientResponseDtoSchema,
          },
        },
      },
      400: {
        description: "The request body was invalid.",
        content: {
          "application/json": {
            schema: createUserIngredientValidationErrorResponseDtoSchema,
          },
        },
      },
      401: {
        description: "The request was unauthenticated.",
        content: {
          "application/json": {
            schema: createUserIngredientUnauthorizedResponseDtoSchema,
          },
        },
      },
    },
  });
}
