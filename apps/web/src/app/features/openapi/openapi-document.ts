import {
  OpenAPIRegistry,
  OpenApiGeneratorV31,
} from "@asteasolutions/zod-to-openapi";
import { registerApiRoutes } from "./register-api-routes";

function createOpenApiDocument() {
  const registry = new OpenAPIRegistry();

  registerApiRoutes(registry);

  const generator = new OpenApiGeneratorV31(registry.definitions);

  return generator.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "MealOS Web API",
      version: "1.0.0",
      description: "OpenAPI specification for the MealOS web application API.",
    },
  });
}

export const openApiDocument = createOpenApiDocument();
