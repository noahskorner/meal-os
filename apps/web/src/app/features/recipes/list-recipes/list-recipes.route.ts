import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  listRecipesResponseDtoSchema,
  listRecipesUnauthorizedResponseDtoSchema,
  listRecipesValidationErrorResponseDtoSchema,
} from "./list-recipes.dto";
import { listRecipesQueryRequestSchema } from "./list-recipes.request";

export function registerListRecipesRoute(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "get",
    path: "/api/recipes",
    operationId: "listRecipes",
    tags: ["Recipes"],
    summary: "List recipes",
    description:
      "Lists paginated recipe metadata visible to the authenticated user.",
    request: {
      query: listRecipesQueryRequestSchema,
    },
    responses: {
      200: {
        description: "Paginated recipes visible to the authenticated user.",
        content: {
          "application/json": {
            schema: listRecipesResponseDtoSchema,
          },
        },
      },
      400: {
        description: "The query parameters were invalid.",
        content: {
          "application/json": {
            schema: listRecipesValidationErrorResponseDtoSchema,
          },
        },
      },
      401: {
        description: "The request was unauthenticated.",
        content: {
          "application/json": {
            schema: listRecipesUnauthorizedResponseDtoSchema,
          },
        },
      },
    },
  });
}
