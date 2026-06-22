import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";

declare global {
  var prisma: PrismaClient | undefined;
  var prismaPromise: Promise<PrismaClient> | undefined;
}

export async function createPrismaClient(): Promise<PrismaClient> {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Configure your runtime environment.",
    );
  }

  const adapter = new PrismaPg({
    connectionString,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export async function getPrismaClient(): Promise<PrismaClient> {
  if (globalThis.prisma) {
    return globalThis.prisma;
  }

  if (globalThis.prismaPromise) {
    return globalThis.prismaPromise;
  }

  globalThis.prismaPromise = createPrismaClient();

  const client = await globalThis.prismaPromise;

  if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = client;
  }

  return client;
}

export type { Prisma } from "./generated/prisma/client.js";
export { PrismaClient };
