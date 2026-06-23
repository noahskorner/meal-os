import { defineConfig } from "@playwright/test";
import { fileURLToPath } from "node:url";

const port = process.env.PORT ?? "3020";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;
const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "dot" : "list",
  timeout: 30_000,
  use: {
    baseURL,
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: `npm run start:test-server --workspace=web-test -- --port ${port}`,
        cwd: repoRoot,
        reuseExistingServer: false,
        timeout: 240_000,
        url: baseURL,
      },
});
