import type { ServiceToken } from "./service-scope.js";

export function createToken<T>(description: string): ServiceToken<T> {
  return Symbol(description) as ServiceToken<T>;
}
