import { createPrismaClient, type PrismaClient } from "@repo/db";
import {
  createToken,
  ServiceCollection,
  type ServiceScope,
} from "@repo/dependency-injection";
import type { AuthProvider } from "@/app/features/auth/auth-provider";
import { MockAuthProvider } from "@/app/features/auth/mock-auth.provider";
import { SupabaseAuthProvider } from "@/app/features/auth/supabase-auth.provider";
import { GetProfileController } from "@/app/features/profiles/get-profile/get-profile.controller";
import { GetProfileFacade } from "@/app/features/profiles/get-profile/get-profile.facade";
import { GetProfileRepository } from "@/app/features/profiles/get-profile/get-profile.repository";
import { GetProfileService } from "@/app/features/profiles/get-profile/get-profile.service";

export const SERVICE_TOKENS = {
  prisma: createToken<PrismaClient>("prisma"),
  authProvider: createToken<AuthProvider>("authProvider"),
  getProfileRepository: createToken<GetProfileRepository>(
    "getProfileRepository",
  ),
  getProfileService: createToken<GetProfileService>("getProfileService"),
  getProfileFacade: createToken<GetProfileFacade>("getProfileFacade"),
  getProfileController: createToken<GetProfileController>("getProfileController"),
} as const;

const services = new ServiceCollection();

services.registerSingleton(SERVICE_TOKENS.prisma, () => {
  return createPrismaClient();
});

services.registerScoped(SERVICE_TOKENS.authProvider, () => {
  return process.env.AUTH_PROVIDER === "mock"
    ? new MockAuthProvider()
    : new SupabaseAuthProvider();
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

services.registerScoped(SERVICE_TOKENS.getProfileController, async (scope) => {
  return new GetProfileController(
    await scope.resolve(SERVICE_TOKENS.authProvider),
    await scope.resolve(SERVICE_TOKENS.getProfileFacade),
  );
});

export function createServiceScope(): ServiceScope {
  return services.createScope();
}
