import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { listIngredientCategoriesResponseDtoSchema } from "./list-ingredient-categories.dto";

export function registerListIngredientCategoriesRoute(
  registry: OpenAPIRegistry,
) {
  registry.registerPath({
    method: "get",
    path: "/api/ingredient-categories",
    operationId: "listIngredientCategories",
    tags: ["Ingredient Categories"],
    summary: "List ingredient categories",
    description: "Returns all ingredient categories.",
    responses: {
      200: {
        description: "A list of ingredient categories.",
        content: {
          "application/json": {
            schema: listIngredientCategoriesResponseDtoSchema,
          },
        },
      },
    },
  });
}
