import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  getProfileForbiddenResponseDtoSchema,
  getProfileNotFoundResponseDtoSchema,
  getProfileResponseDtoSchema,
  getProfileUnauthorizedResponseDtoSchema,
  getProfileValidationErrorResponseDtoSchema,
} from "./get-profile.dto";
import { getProfileRequestSchema } from "./get-profile.request";

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
            schema: getProfileResponseDtoSchema,
          },
        },
      },
      400: {
        description: "The route parameters were invalid.",
        content: {
          "application/json": {
            schema: getProfileValidationErrorResponseDtoSchema,
          },
        },
      },
      401: {
        description: "The request was unauthenticated.",
        content: {
          "application/json": {
            schema: getProfileUnauthorizedResponseDtoSchema,
          },
        },
      },
      403: {
        description: "The authenticated user cannot access this profile.",
        content: {
          "application/json": {
            schema: getProfileForbiddenResponseDtoSchema,
          },
        },
      },
      404: {
        description: "The profile was not found.",
        content: {
          "application/json": {
            schema: getProfileNotFoundResponseDtoSchema,
          },
        },
      },
    },
  });
}
