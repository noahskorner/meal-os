import type { ServiceCollection } from "@repo/dependency-injection";
import { SERVICE_TOKENS } from "@/app/features/service-tokens";
import { GetProfileController } from "./get-profile.controller";
import { GetProfileFacade } from "./get-profile.facade";
import { GetProfileRepository } from "./get-profile.repository";
import { GetProfileService } from "./get-profile.service";

export function registerGetProfile(services: ServiceCollection) {
  services.registerScoped(
    SERVICE_TOKENS.getProfileRepository,
    async (scope) => {
      return new GetProfileRepository(
        await scope.resolve(SERVICE_TOKENS.prisma),
      );
    },
  );

  services.registerScoped(SERVICE_TOKENS.getProfileService, () => {
    return new GetProfileService();
  });

  services.registerScoped(SERVICE_TOKENS.getProfileFacade, async (scope) => {
    return new GetProfileFacade(
      await scope.resolve(SERVICE_TOKENS.getProfileService),
      await scope.resolve(SERVICE_TOKENS.getProfileRepository),
    );
  });

  services.registerScoped(
    SERVICE_TOKENS.getProfileController,
    async (scope) => {
      return new GetProfileController(
        await scope.resolve(SERVICE_TOKENS.authProvider),
        await scope.resolve(SERVICE_TOKENS.getProfileFacade),
      );
    },
  );
}
