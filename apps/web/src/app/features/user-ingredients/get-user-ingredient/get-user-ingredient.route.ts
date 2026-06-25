import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  getUserIngredientNotFoundResponseDtoSchema,
  getUserIngredientResponseDtoSchema,
  getUserIngredientUnauthorizedResponseDtoSchema,
  getUserIngredientValidationErrorResponseDtoSchema,
} from "./get-user-ingredient.dto";
import { getUserIngredientRequestSchema } from "./get-user-ingredient.request";

export function registerGetUserIngredientRoute(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "get",
    path: "/api/user-ingredients/{userIngredientId}",
    operationId: "getUserIngredient",
    tags: ["User Ingredients"],
    summary: "Get user ingredient",
    description: "Returns a user ingredient visible to the authenticated user.",
    request: {
      params: getUserIngredientRequestSchema,
    },
    responses: {
      200: {
        description: "The user ingredient was found.",
        content: {
          "application/json": {
            schema: getUserIngredientResponseDtoSchema,
          },
        },
      },
      400: {
        description: "The route parameters were invalid.",
        content: {
          "application/json": {
            schema: getUserIngredientValidationErrorResponseDtoSchema,
          },
        },
      },
      401: {
        description: "The request was unauthenticated.",
        content: {
          "application/json": {
            schema: getUserIngredientUnauthorizedResponseDtoSchema,
          },
        },
      },
      404: {
        description:
          "The user ingredient does not exist or is not visible to the authenticated user.",
        content: {
          "application/json": {
            schema: getUserIngredientNotFoundResponseDtoSchema,
          },
        },
      },
    },
  });
}
