import "dotenv/config";
import { defineConfig } from "prisma/config";

const directUrl =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@127.0.0.1:5432/postgres";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    initShadowDb: `
      create schema if not exists auth;
      create table if not exists auth.users (
        id uuid primary key
      );
    `,
  },
  datasource: {
    url: directUrl,
  },
  experimental: {
    externalTables: true,
  },
  tables: {
    external: ["auth.users"],
  },
});
