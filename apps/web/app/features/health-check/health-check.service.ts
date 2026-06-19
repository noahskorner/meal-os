import type { HealthCheckResponse } from "./health-check.response";

export function createHealthCheck(
  includeTimestamp: boolean,
): HealthCheckResponse {
  return {
    status: "ok",
    service: "web",
    ...(includeTimestamp ? { timestamp: new Date().toISOString() } : {}),
  };
}
