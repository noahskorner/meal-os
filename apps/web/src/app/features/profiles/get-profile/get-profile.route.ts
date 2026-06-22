import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { getProfileRequestSchema } from "./get-profile.request";
import {
  getProfileNotFoundResponseSchema,
  getProfileResponseSchema,
  getProfileValidationErrorResponseSchema,
} from "./get-profile.response";

export function registerGetProfileRoute(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "get",
    path: "/api/profiles/{id}",
    tags: ["Profiles"],
    summary: "Get profile",
    description: "Returns a profile by ID.",
    request: {
      params: getProfileRequestSchema,
    },
    responses: {
      200: {
        description: "The profile was found.",
        content: {
          "application/json": {
            schema: getProfileResponseSchema,
          },
        },
      },
      400: {
        description: "The route parameters were invalid.",
        content: {
          "application/json": {
            schema: getProfileValidationErrorResponseSchema,
          },
        },
      },
      404: {
        description: "The profile was not found.",
        content: {
          "application/json": {
            schema: getProfileNotFoundResponseSchema,
          },
        },
      },
    },
  });
}
