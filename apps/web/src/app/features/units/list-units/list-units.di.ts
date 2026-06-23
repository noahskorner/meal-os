import type { ServiceCollection } from "@repo/dependency-injection";
import { SERVICE_TOKENS } from "@/app/features/service-tokens";
import { ListUnitsController } from "./list-units.controller";
import { ListUnitsFacade } from "./list-units.facade";
import { ListUnitsRepository } from "./list-units.repository";
import { ListUnitsService } from "./list-units.service";

export function registerListUnits(services: ServiceCollection) {
  services.registerScoped(SERVICE_TOKENS.listUnitsRepository, async (scope) => {
    return new ListUnitsRepository(await scope.resolve(SERVICE_TOKENS.prisma));
  });

  services.registerScoped(SERVICE_TOKENS.listUnitsService, () => {
    return new ListUnitsService();
  });

  services.registerScoped(SERVICE_TOKENS.listUnitsFacade, async (scope) => {
    return new ListUnitsFacade(
      await scope.resolve(SERVICE_TOKENS.listUnitsService),
      await scope.resolve(SERVICE_TOKENS.listUnitsRepository),
    );
  });

  services.registerScoped(SERVICE_TOKENS.listUnitsController, async (scope) => {
    return new ListUnitsController(
      await scope.resolve(SERVICE_TOKENS.listUnitsFacade),
    );
  });
}
