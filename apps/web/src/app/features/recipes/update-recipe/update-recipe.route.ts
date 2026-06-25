import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  updateRecipeNotFoundResponseDtoSchema,
  updateRecipeUnauthorizedResponseDtoSchema,
  updateRecipeValidationErrorResponseDtoSchema,
} from "./update-recipe.dto";
import {
  updateRecipeBodyRequestSchema,
  updateRecipeParamsRequestSchema,
} from "./update-recipe.request";

export function registerUpdateRecipeRoute(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "put",
    path: "/api/recipes/{id}",
    operationId: "updateRecipe",
    tags: ["Recipes"],
    summary: "Update recipe",
    description: "Updates a recipe owned by the authenticated user.",
    request: {
      params: updateRecipeParamsRequestSchema,
      body: {
        required: true,
        content: {
          "application/json": {
            schema: updateRecipeBodyRequestSchema,
          },
        },
      },
    },
    responses: {
      204: {
        description: "The recipe was updated.",
      },
      400: {
        description: "The route parameters or request body were invalid.",
        content: {
          "application/json": {
            schema: updateRecipeValidationErrorResponseDtoSchema,
          },
        },
      },
      401: {
        description: "The request was unauthenticated.",
        content: {
          "application/json": {
            schema: updateRecipeUnauthorizedResponseDtoSchema,
          },
        },
      },
      404: {
        description:
          "The recipe does not exist or is not owned by the authenticated user.",
        content: {
          "application/json": {
            schema: updateRecipeNotFoundResponseDtoSchema,
          },
        },
      },
    },
  });
}
