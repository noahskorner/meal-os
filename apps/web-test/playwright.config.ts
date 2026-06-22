import { defineConfig } from "@playwright/test";
import { fileURLToPath } from "node:url";

const port = process.env.PORT ?? "3000";
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
        command: `npm run build --workspace=web && npm run start --workspace=web -- --hostname 127.0.0.1 --port ${port}`,
        cwd: repoRoot,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        url: baseURL,
      },
});
