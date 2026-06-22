import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { seedTasks } from "./seeds/index.js";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DIRECT_URL or DATABASE_URL must be set before running prisma db seed.",
  );
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString,
  }),
  log: ["error"],
});

const main = async () => {
  let totalRows = 0;

  for (const task of seedTasks) {
    console.info(`[seed] Seeding ${task.name}...`);

    const rows = await task.run(prisma);
    totalRows += rows;

    console.info(`[seed] ${task.name}: ${rows} records synced.`);
  }

  console.info(
    `[seed] Complete. ${totalRows} records synced across ${seedTasks.length} tables.`,
  );
};

main()
  .catch((error) => {
    console.error("[seed] Failed to seed database.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
