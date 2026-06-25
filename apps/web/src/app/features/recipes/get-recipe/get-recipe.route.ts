import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  getRecipeNotFoundResponseDtoSchema,
  getRecipeResponseDtoSchema,
  getRecipeUnauthorizedResponseDtoSchema,
  getRecipeValidationErrorResponseDtoSchema,
} from "./get-recipe.dto";
import { getRecipeRequestSchema } from "./get-recipe.request";

export function registerGetRecipeRoute(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "get",
    path: "/api/recipes/{recipeId}",
    operationId: "getRecipe",
    tags: ["Recipes"],
    summary: "Get recipe",
    description: "Returns a recipe visible to the authenticated user.",
    request: {
      params: getRecipeRequestSchema,
    },
    responses: {
      200: {
        description: "The recipe was found.",
        content: {
          "application/json": {
            schema: getRecipeResponseDtoSchema,
          },
        },
      },
      400: {
        description: "The route parameters were invalid.",
        content: {
          "application/json": {
            schema: getRecipeValidationErrorResponseDtoSchema,
          },
        },
      },
      401: {
        description: "The request was unauthenticated.",
        content: {
          "application/json": {
            schema: getRecipeUnauthorizedResponseDtoSchema,
          },
        },
      },
      404: {
        description:
          "The recipe does not exist or is not visible to the authenticated user.",
        content: {
          "application/json": {
            schema: getRecipeNotFoundResponseDtoSchema,
          },
        },
      },
    },
  });
}
