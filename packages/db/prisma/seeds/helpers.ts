import type { PrismaClient } from "../../src/generated/prisma/client.js";

export type SeedTask = {
  name: string;
  run: (prisma: PrismaClient) => Promise<number>;
};

export const defineSeed = (
  name: SeedTask["name"],
  run: SeedTask["run"],
): SeedTask => ({
  name,
  run,
});

export const getRequiredValue = <T>(
  lookup: ReadonlyMap<string, T>,
  key: string,
  label: string,
): T => {
  const value = lookup.get(key);

  if (!value) {
    throw new Error(`${label} "${key}" was not found while seeding.`);
  }

  return value;
};

export const toNameIdMap = <T extends { id: string; name: string }>(
  records: readonly T[],
): Map<string, string> =>
  new Map(records.map((record) => [record.name, record.id]));

export const longRunningTransactionOptions = {
  maxWait: 30_000,
  timeout: 120_000,
} as const;
