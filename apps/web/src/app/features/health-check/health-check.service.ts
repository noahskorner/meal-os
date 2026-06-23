import type { HealthCheckResponse } from "./health-check.response";

export class HealthCheckService {
  public create(includeTimestamp: boolean): HealthCheckResponse {
    return {
      status: "ok",
      service: "web",
      ...(includeTimestamp ? { timestamp: new Date().toISOString() } : {}),
    };
  }
}
