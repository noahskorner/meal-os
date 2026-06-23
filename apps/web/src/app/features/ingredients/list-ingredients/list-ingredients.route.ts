import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  listIngredientsResponseDtoSchema,
  listIngredientsValidationErrorResponseDtoSchema,
} from "./list-ingredients.dto";
import { listIngredientsRequestSchema } from "./list-ingredients.request";

export function registerListIngredientsRoute(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "get",
    path: "/api/ingredients",
    tags: ["Ingredients"],
    summary: "List ingredients",
    description:
      "Returns a paginated list of ingredients with aliases, category, and default unit details.",
    request: {
      query: listIngredientsRequestSchema,
    },
    responses: {
      200: {
        description: "A paginated list of ingredients.",
        content: {
          "application/json": {
            schema: listIngredientsResponseDtoSchema,
          },
        },
      },
      400: {
        description: "The query parameters were invalid.",
        content: {
          "application/json": {
            schema: listIngredientsValidationErrorResponseDtoSchema,
          },
        },
      },
    },
  });
}
