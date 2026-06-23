import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { listUnitsResponseDtoSchema } from "./list-units.dto";

export function registerListUnitsRoute(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "get",
    path: "/api/units",
    operationId: "listUnits",
    tags: ["Units"],
    summary: "List units",
    description: "Returns all units.",
    responses: {
      200: {
        description: "A list of units.",
        content: {
          "application/json": {
            schema: listUnitsResponseDtoSchema,
          },
        },
      },
    },
  });
}
