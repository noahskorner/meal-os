import { spawn, type ChildProcess } from "node:child_process";
import { once } from "node:events";
import { readdir, rm } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { Client } from "pg";
import { GenericContainer, Wait } from "testcontainers";
import type { StartedTestContainer } from "testcontainers";
import { E2E_TEST_USERS } from "./test-users";

const repoRoot = fileURLToPath(new URL("../../..", import.meta.url));
const npmCommand = "npm";
const portArgumentIndex = process.argv.indexOf("--port");
const port =
  (portArgumentIndex >= 0 ? process.argv[portArgumentIndex + 1] : undefined) ??
  process.env.PORT ??
  "3000";
const databaseName = "meal_os_test";
const databaseUser = "postgres";
const databasePassword = "postgres";
const migrationsDirectory = path.join(repoRoot, "packages", "db", "prisma", "migrations");

function sanitizeEnvironment(
  env: NodeJS.ProcessEnv,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(env).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
}

async function runNpmCommand(
  args: string[],
  env: NodeJS.ProcessEnv,
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(npmCommand, args, {
      cwd: repoRoot,
      env: sanitizeEnvironment(env),
      shell: process.platform === "win32",
      stdio: "inherit",
    });

    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `Command failed: ${npmCommand} ${args.join(" ")} (exit code ${code ?? "unknown"})`,
        ),
      );
    });
  });
}

async function initializeAuthSchema(connectionString: string): Promise<void> {
  const client = new Client({ connectionString });

  await client.connect();

  try {
    await client.query("create schema if not exists auth;");
    await client.query(`
      create table if not exists auth.users (
        id uuid primary key
      );
    `);
  } finally {
    await client.end();
  }
}

async function removeEmptyIncompleteMigrationDirectories(): Promise<void> {
  const entries = await readdir(migrationsDirectory, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const migrationDirectory = path.join(migrationsDirectory, entry.name);
    const migrationEntries = await readdir(migrationDirectory);

    if (migrationEntries.includes("migration.sql")) {
      continue;
    }

    if (migrationEntries.length > 0) {
      throw new Error(
        `Migration directory ${entry.name} is missing migration.sql.`,
      );
    }

    await rm(migrationDirectory, { recursive: true, force: true });
  }
}

async function seedUsersAndProfiles(connectionString: string): Promise<void> {
  const client = new Client({ connectionString });
  const userIds = Object.values(E2E_TEST_USERS).map(({ id }) => id);

  await client.connect();

  try {
    await client.query("begin");

    for (const userId of userIds) {
      await client.query(
        "insert into auth.users (id) values ($1) on conflict (id) do nothing",
        [userId],
      );
      await client.query(
        "insert into public.profiles (id) values ($1) on conflict (id) do nothing",
        [userId],
      );
    }

    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    await client.end();
  }
}

async function stopProcess(child: ChildProcess | undefined): Promise<void> {
  if (!child || child.exitCode !== null) {
    return;
  }

  child.kill("SIGTERM");

  try {
    await once(child, "exit");
  } catch {
    // Ignore teardown races when the child exits while shutting down.
  }
}

async function main() {
  let container: StartedTestContainer | undefined;
  let serverProcess: ChildProcess | undefined;
  let shuttingDown = false;

  const shutdown = async (exitCode = 0) => {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;

    try {
      await stopProcess(serverProcess);
    } finally {
      await container?.stop();
      process.exit(exitCode);
    }
  };

  process.on("SIGINT", () => {
    void shutdown(0);
  });
  process.on("SIGTERM", () => {
    void shutdown(0);
  });

  try {
    container = await new GenericContainer("postgres:16-alpine")
      .withEnvironment({
        POSTGRES_DB: databaseName,
        POSTGRES_USER: databaseUser,
        POSTGRES_PASSWORD: databasePassword,
      })
      .withExposedPorts(5432)
      .withWaitStrategy(
        Wait.forLogMessage(
          "database system is ready to accept connections",
          2,
        ),
      )
      .start();

    const databaseUrl = `postgresql://${databaseUser}:${databasePassword}@${container.getHost()}:${container.getMappedPort(5432)}/${databaseName}`;
    const testEnvironment = {
      ...process.env,
      AUTH_PROVIDER: "mock",
      DATABASE_URL: databaseUrl,
      DIRECT_URL: databaseUrl,
    };

    await initializeAuthSchema(databaseUrl);
    await removeEmptyIncompleteMigrationDirectories();
    await runNpmCommand(
      ["run", "build", "--workspace=@repo/dependency-injection"],
      testEnvironment,
    );
    await runNpmCommand(["run", "build", "--workspace=@repo/db"], testEnvironment);
    await runNpmCommand(
      ["run", "migrate:deploy", "--workspace=@repo/db"],
      testEnvironment,
    );
    await runNpmCommand(["run", "seed", "--workspace=@repo/db"], testEnvironment);
    await seedUsersAndProfiles(databaseUrl);
    await runNpmCommand(["run", "build", "--workspace=web"], testEnvironment);

    serverProcess = spawn(
      npmCommand,
      [
        "run",
        "start",
        "--workspace=web",
        "--",
        "--hostname",
        "127.0.0.1",
        "--port",
        port,
      ],
      {
        cwd: repoRoot,
        env: sanitizeEnvironment(testEnvironment),
        shell: process.platform === "win32",
        stdio: "inherit",
      },
    );

    serverProcess.once("error", async (error) => {
      console.error(error);
      await shutdown(1);
    });

    const [code] = (await once(serverProcess, "exit")) as [number | null];

    if (!shuttingDown) {
      throw new Error(`Web server exited unexpectedly with code ${code ?? "unknown"}.`);
    }
  } catch (error) {
    console.error(error);
    await shutdown(1);
  }
}

void main();
