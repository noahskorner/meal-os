import type {
  ServiceFactory,
  ServiceRegistration,
  ServiceToken,
} from "./service-scope.js";
import { ServiceScope } from "./service-scope.js";

export class ServiceCollection {
  private readonly registrations = new Map<
    ServiceToken<unknown>,
    ServiceRegistration<unknown>
  >();
  private readonly singletons = new Map<ServiceToken<unknown>, Promise<unknown>>();

  registerSingleton<T>(
    token: ServiceToken<T>,
    factory: ServiceFactory<T>,
  ): void {
    this.registrations.set(token, { lifetime: "singleton", factory });
  }

  registerScoped<T>(token: ServiceToken<T>, factory: ServiceFactory<T>): void {
    this.registrations.set(token, { lifetime: "scoped", factory });
  }

  registerTransient<T>(
    token: ServiceToken<T>,
    factory: ServiceFactory<T>,
  ): void {
    this.registrations.set(token, { lifetime: "transient", factory });
  }

  createScope(): ServiceScope {
    return new ServiceScope(this.registrations, this.singletons);
  }
}
