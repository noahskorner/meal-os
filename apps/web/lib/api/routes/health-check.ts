import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { NextRequest, NextResponse } from "next/server";
import { z } from "../openapi/zod";

const healthCheckQuerySchema = z
  .object({
    includeTimestamp: z.enum(["true", "false"]).optional().openapi({
      description: "Set to true to include a timestamp in the response.",
      example: "true",
      param: {
        description: "Set to true to include a timestamp in the response.",
      },
    }),
  })
  .openapi("HealthCheckQuery");

const healthCheckResponseSchema = z
  .object({
    status: z.literal("ok").openapi({ example: "ok" }),
    service: z.literal("web").openapi({ example: "web" }),
    timestamp: z.string().datetime().optional().openapi({
      example: "2026-06-19T14:00:00.000Z",
    }),
  })
  .openapi("HealthCheckResponse");

const validationErrorResponseSchema = z
  .object({
    message: z.string().openapi({ example: "Invalid query parameters." }),
    issues: z.array(z.string()).openapi({
      example: [
        'includeTimestamp: Invalid option: expected one of "true"|"false"',
      ],
    }),
  })
  .openapi("ValidationErrorResponse");

function buildHealthCheckResponse(includeTimestamp: boolean) {
  return healthCheckResponseSchema.parse({
    status: "ok",
    service: "web",
    ...(includeTimestamp ? { timestamp: new Date().toISOString() } : {}),
  });
}

function buildValidationErrorResponse(issues: string[]) {
  return validationErrorResponseSchema.parse({
    message: "Invalid query parameters.",
    issues,
  });
}

export function registerHealthCheckRoute(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "get",
    path: "/api/health-check",
    tags: ["System"],
    summary: "Health check",
    description: "Returns the basic status of the web application.",
    request: {
      query: healthCheckQuerySchema,
    },
    responses: {
      200: {
        description: "The application is healthy.",
        content: {
          "application/json": {
            schema: healthCheckResponseSchema,
          },
        },
      },
      400: {
        description: "The request query parameters were invalid.",
        content: {
          "application/json": {
            schema: validationErrorResponseSchema,
          },
        },
      },
    },
  });
}

export async function GET(request: NextRequest) {
  const parsedQuery = healthCheckQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams)
  );

  if (!parsedQuery.success) {
    const response = buildValidationErrorResponse(
      parsedQuery.error.issues.map(({ path, message }) => {
        const key = path.join(".") || "query";

        return `${key}: ${message}`;
      })
    );

    return NextResponse.json(response, { status: 400 });
  }

  const response = buildHealthCheckResponse(
    parsedQuery.data.includeTimestamp === "true"
  );

  return NextResponse.json(response);
}
