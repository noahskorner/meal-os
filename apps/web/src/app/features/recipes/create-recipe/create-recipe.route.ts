import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  createRecipeResponseDtoSchema,
  createRecipeUnauthorizedResponseDtoSchema,
  createRecipeValidationErrorResponseDtoSchema,
} from "./create-recipe.dto";
import { createRecipeRequestSchema } from "./create-recipe.request";

export function registerCreateRecipeRoute(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "post",
    path: "/api/recipes",
    operationId: "createRecipe",
    tags: ["Recipes"],
    summary: "Create recipe",
    description: "Creates a recipe for the authenticated user.",
    request: {
      body: {
        required: true,
        content: {
          "application/json": {
            schema: createRecipeRequestSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "The recipe was created.",
        headers: {
          Location: {
            description: "Location of the created recipe resource.",
            schema: {
              type: "string",
            },
          },
        },
        content: {
          "application/json": {
            schema: createRecipeResponseDtoSchema,
          },
        },
      },
      400: {
        description: "The request body was invalid.",
        content: {
          "application/json": {
            schema: createRecipeValidationErrorResponseDtoSchema,
          },
        },
      },
      401: {
        description: "The request was unauthenticated.",
        content: {
          "application/json": {
            schema: createRecipeUnauthorizedResponseDtoSchema,
          },
        },
      },
    },
  });
}
