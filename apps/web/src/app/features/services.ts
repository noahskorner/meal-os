import { createPrismaClient, type PrismaClient } from "@repo/db";
import {
  createToken,
  ServiceCollection,
  type ServiceScope,
} from "@repo/dependency-injection";
import { GetProfileFacade } from "@/app/features/profiles/get-profile/get-profile.facade";
import { GetProfileRepository } from "@/app/features/profiles/get-profile/get-profile.repository";
import { GetProfileService } from "@/app/features/profiles/get-profile/get-profile.service";

export const SERVICE_TOKENS = {
  prisma: createToken<PrismaClient>("prisma"),
  getProfileRepository: createToken<GetProfileRepository>(
    "getProfileRepository",
  ),
  getProfileService: createToken<GetProfileService>("getProfileService"),
  getProfileFacade: createToken<GetProfileFacade>("getProfileFacade"),
} as const;

const services = new ServiceCollection();

services.registerSingleton(SERVICE_TOKENS.prisma, () => {
  return createPrismaClient();
});

services.registerScoped(SERVICE_TOKENS.getProfileRepository, async (scope) => {
  return new GetProfileRepository(await scope.resolve(SERVICE_TOKENS.prisma));
});

services.registerScoped(SERVICE_TOKENS.getProfileService, async (scope) => {
  return new GetProfileService(
    await scope.resolve(SERVICE_TOKENS.getProfileRepository),
  );
});

services.registerScoped(SERVICE_TOKENS.getProfileFacade, async (scope) => {
  return new GetProfileFacade(
    await scope.resolve(SERVICE_TOKENS.getProfileService),
  );
});

export function createServiceScope(): ServiceScope {
  return services.createScope();
}
