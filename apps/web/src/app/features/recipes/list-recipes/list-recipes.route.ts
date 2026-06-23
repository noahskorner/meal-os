import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  listRecipesResponseDtoSchema,
  listRecipesUnauthorizedResponseDtoSchema,
} from "./list-recipes.dto";

export function registerListRecipesRoute(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "get",
    path: "/api/recipes",
    operationId: "listRecipes",
    tags: ["Recipes"],
    summary: "List recipes",
    description: "Lists recipe metadata visible to the authenticated user.",
    responses: {
      200: {
        description: "Recipes visible to the authenticated user.",
        content: {
          "application/json": {
            schema: listRecipesResponseDtoSchema,
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
