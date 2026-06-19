import { NextRequest, NextResponse } from "next/server";
import {
  createHealthCheckValidationError,
  getHealthCheck,
} from "@/app/features/health-check/health-check.facade";
import { healthCheckRequestSchema } from "@/app/features/health-check/health-check.request";

export function GET(request: NextRequest) {
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

  return NextResponse.json(getHealthCheck(parsedQuery.data));
}
