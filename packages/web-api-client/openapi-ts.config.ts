import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./src/generated/openapi.json",
  output: {
    clean: true,
    path: "./src/generated",
    postProcess: ["prettier"],
    source: {
      fileName: "openapi",
      path: "./source",
    },
  },
  plugins: [
    "@hey-api/client-fetch",
    {
      name: "@hey-api/typescript",
      enums: "typescript",
    },
    {
      name: "@hey-api/sdk",
      operations: {
        strategy: "flat",
      },
    },
  ],
});
