import type { HealthCheckRequest } from "./health-check.request";
import type { HealthCheckResponse } from "./health-check.response";
import { HealthCheckService } from "./health-check.service";

export class HealthCheckFacade {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  public get(request: HealthCheckRequest): HealthCheckResponse {
    return this.healthCheckService.create(request.includeTimestamp === "true");
  }
}
