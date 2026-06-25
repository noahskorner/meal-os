import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  listUserIngredientsResponseDtoSchema,
  listUserIngredientsUnauthorizedResponseDtoSchema,
  listUserIngredientsValidationErrorResponseDtoSchema,
} from "./list-user-ingredients.dto";
import { listUserIngredientsQueryRequestSchema } from "./list-user-ingredients.request";

export function registerListUserIngredientsRoute(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "get",
    path: "/api/user-ingredients",
    operationId: "listUserIngredients",
    tags: ["User Ingredients"],
    summary: "List user ingredients",
    description:
      "Lists paginated user ingredients created by the authenticated user.",
    request: {
      query: listUserIngredientsQueryRequestSchema,
    },
    responses: {
      200: {
        description:
          "Paginated user ingredients created by the authenticated user.",
        content: {
          "application/json": {
            schema: listUserIngredientsResponseDtoSchema,
          },
        },
      },
      400: {
        description: "The query parameters were invalid.",
        content: {
          "application/json": {
            schema: listUserIngredientsValidationErrorResponseDtoSchema,
          },
        },
      },
      401: {
        description: "The request was unauthenticated.",
        content: {
          "application/json": {
            schema: listUserIngredientsUnauthorizedResponseDtoSchema,
          },
        },
      },
    },
  });
}
