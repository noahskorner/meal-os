export type ServiceToken<T> = symbol & { readonly __type?: T };
export type ServiceLifetime = "singleton" | "scoped" | "transient";
export type ServiceFactory<T> = (scope: ServiceScope) => T | Promise<T>;
export type ServiceRegistration<T> = {
  lifetime: ServiceLifetime;
  factory: ServiceFactory<T>;
};

export class ServiceScope {
  private readonly scopedInstances = new Map<
    ServiceToken<unknown>,
    Promise<unknown>
  >();

  constructor(
    private readonly registrations: Map<
      ServiceToken<unknown>,
      ServiceRegistration<unknown>
    >,
    private readonly singletons: Map<ServiceToken<unknown>, Promise<unknown>>,
  ) {}

  async resolve<T>(token: ServiceToken<T>): Promise<T> {
    const registration = this.registrations.get(token);

    if (!registration) {
      throw new Error(`Service not registered: ${String(token.description)}`);
    }

    if (registration.lifetime === "singleton") {
      if (!this.singletons.has(token)) {
        this.singletons.set(
          token,
          this.createCachedInstance(token, registration, this.singletons),
        );
      }

      return (await this.singletons.get(token)) as T;
    }

    if (registration.lifetime === "scoped") {
      if (!this.scopedInstances.has(token)) {
        this.scopedInstances.set(
          token,
          this.createCachedInstance(token, registration, this.scopedInstances),
        );
      }

      return (await this.scopedInstances.get(token)) as T;
    }

    return (await registration.factory(this)) as T;
  }

  private createCachedInstance<T>(
    token: ServiceToken<T>,
    registration: ServiceRegistration<T>,
    cache: Map<ServiceToken<unknown>, Promise<unknown>>,
  ): Promise<T> {
    return Promise.resolve(registration.factory(this)).catch((error: unknown) => {
      cache.delete(token);
      throw error;
    });
  }
}
