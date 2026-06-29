import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { openApiDocument } from "../../../apps/web/src/app/features/openapi/openapi-document";

const currentFilePath = fileURLToPath(import.meta.url);
const packageRoot = path.resolve(path.dirname(currentFilePath), "..");
const outputPath = path.join(packageRoot, "src", "openapi.json");

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(openApiDocument, null, 2)}\n`);
