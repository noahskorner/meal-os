import {
  OpenAPIRegistry,
  OpenApiGeneratorV31,
} from "@asteasolutions/zod-to-openapi";
import { registerApiRoutes } from "../routes";

function createOpenApiDocument() {
  const registry = new OpenAPIRegistry();

  registerApiRoutes(registry);

  const generator = new OpenApiGeneratorV31(registry.definitions);

  return generator.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "Theta Web API",
      version: "1.0.0",
      description: "OpenAPI specification for the Theta web application API.",
    },
  });
}

export const openApiDocument = createOpenApiDocument();
