import type { ServiceCollection } from "@repo/dependency-injection";
import { SERVICE_TOKENS } from "@/app/features/service-tokens";
import { HealthCheckController } from "./health-check.controller";
import { HealthCheckFacade } from "./health-check.facade";
import { HealthCheckService } from "./health-check.service";

export function registerHealthCheck(services: ServiceCollection) {
  services.registerScoped(SERVICE_TOKENS.healthCheckService, () => {
    return new HealthCheckService();
  });

  services.registerScoped(SERVICE_TOKENS.healthCheckFacade, async (scope) => {
    return new HealthCheckFacade(
      await scope.resolve(SERVICE_TOKENS.healthCheckService),
    );
  });

  services.registerScoped(
    SERVICE_TOKENS.healthCheckController,
    async (scope) => {
      return new HealthCheckController(
        await scope.resolve(SERVICE_TOKENS.healthCheckFacade),
      );
    },
  );
}
