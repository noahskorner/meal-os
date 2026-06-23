import {
  createHealthCheckResponseDto,
  createHealthCheckValidationErrorResponseDto,
  type HealthCheckResponseDto,
  type HealthCheckValidationErrorResponseDto,
} from "./health-check.dto";
import { HealthCheckFacade } from "./health-check.facade";
import type { HealthCheckRequest } from "./health-check.request";

export type HealthCheckResult = {
  status: 200;
  body: HealthCheckResponseDto;
};

export class HealthCheckController {
  constructor(private readonly healthCheckFacade: HealthCheckFacade) {}

  public get(request: HealthCheckRequest): HealthCheckResult {
    const response = this.healthCheckFacade.get(request);

    return {
      status: 200,
      body: createHealthCheckResponseDto(response),
    };
  }
}

export function createHealthCheckValidationError(
  issues: string[],
): HealthCheckValidationErrorResponseDto {
  return createHealthCheckValidationErrorResponseDto(issues);
}
