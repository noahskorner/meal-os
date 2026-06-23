import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { getPrismaClient, type PrismaClient } from "@repo/db";

const runtimeConfigPath = fileURLToPath(
  new URL("../.test-runtime/database.json", import.meta.url),
);

type RuntimeDatabaseConfig = {
  databaseUrl: string;
};

async function resolveDatabaseUrl(): Promise<string> {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const content = await readFile(runtimeConfigPath, "utf8");
  const config: RuntimeDatabaseConfig = JSON.parse(content);

  return config.databaseUrl;
}

export async function getTestPrismaClient(): Promise<PrismaClient> {
  process.env.DATABASE_URL = await resolveDatabaseUrl();

  return getPrismaClient();
}
