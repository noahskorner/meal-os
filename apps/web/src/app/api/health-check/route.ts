import { NextRequest, NextResponse } from "next/server";
import { createHealthCheckValidationError } from "@/app/features/health-check/health-check.controller";
import { healthCheckRequestSchema } from "@/app/features/health-check/health-check.request";
import { createServiceScope, SERVICE_TOKENS } from "@/app/features/services";

export async function GET(request: NextRequest) {
  const parsedQuery = healthCheckRequestSchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );

  if (!parsedQuery.success) {
    return NextResponse.json(
      createHealthCheckValidationError(
        parsedQuery.error.issues.map(({ path, message }) => {
          const key = path.join(".") || "query";

          return `${key}: ${message}`;
        }),
      ),
      { status: 400 },
    );
  }

  const scope = createServiceScope();
  const healthCheckController = await scope.resolve(
    SERVICE_TOKENS.healthCheckController,
  );
  const response = healthCheckController.get(parsedQuery.data);

  return NextResponse.json(response.body, { status: response.status });
}
