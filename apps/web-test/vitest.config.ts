import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const webSrcPath = fileURLToPath(new URL("../web/src", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": webSrcPath,
    },
  },
  test: {
    dir: "./unit",
    environment: "node",
    globals: false,
  },
});
