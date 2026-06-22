import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createRecipeRequestSchema } from "./create-recipe.request";
import {
  createRecipeResponseSchema,
  createRecipeUnauthorizedResponseSchema,
  createRecipeValidationErrorResponseSchema,
} from "./create-recipe.response";

export function registerCreateRecipeRoute(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "post",
    path: "/api/recipes",
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
            schema: createRecipeResponseSchema,
          },
        },
      },
      400: {
        description: "The request body was invalid.",
        content: {
          "application/json": {
            schema: createRecipeValidationErrorResponseSchema,
          },
        },
      },
      401: {
        description: "The request was unauthenticated.",
        content: {
          "application/json": {
            schema: createRecipeUnauthorizedResponseSchema,
          },
        },
      },
    },
  });
}
