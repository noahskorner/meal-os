import { lstat, readdir, rm } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const dryRun = process.argv.includes("--dry-run");

const cleanableDirectoryNames = new Set([
  "node_modules",
  ".turbo",
  ".next",
  "out",
  "build",
  "dist",
  "coverage",
  ".vercel",
  ".expo",
  "web-build",
]);

const cleanableFileNames = new Set([
  "package-lock.json",
  "expo-env.d.ts",
]);

const cleanableFileSuffixes = [".tsbuildinfo"];
const ignoredDirectoryNames = new Set([".git"]);
const explicitCleanablePaths = ["packages/db/src/generated"];

const cleanablePaths = new Set();

function toAbsolutePath(relativePath) {
  return path.join(rootDir, relativePath);
}

async function pathExists(relativePath) {
  try {
    await lstat(toAbsolutePath(relativePath));
    return true;
  } catch {
    return false;
  }
}

async function addPathIfExists(relativePath) {
  if (await pathExists(relativePath)) {
    cleanablePaths.add(relativePath);
  }
}

function isCleanableFile(fileName) {
  if (cleanableFileNames.has(fileName)) {
    return true;
  }

  return cleanableFileSuffixes.some((suffix) => fileName.endsWith(suffix));
}

async function collectCleanablePaths(relativeDir = ".") {
  const absoluteDir = relativeDir === "." ? rootDir : toAbsolutePath(relativeDir);
  const entries = await readdir(absoluteDir, { withFileTypes: true });

  for (const entry of entries) {
    const relativePath =
      relativeDir === "." ? entry.name : path.join(relativeDir, entry.name);

    if (entry.isDirectory()) {
      if (cleanableDirectoryNames.has(entry.name)) {
        cleanablePaths.add(relativePath);
        continue;
      }

      if (ignoredDirectoryNames.has(entry.name)) {
        continue;
      }

      await collectCleanablePaths(relativePath);
      continue;
    }

    if (entry.isFile() && isCleanableFile(entry.name)) {
      cleanablePaths.add(relativePath);
    }
  }
}

await Promise.all(explicitCleanablePaths.map(addPathIfExists));
await collectCleanablePaths();

const targets = [...cleanablePaths].sort((left, right) => left.localeCompare(right));

if (targets.length === 0) {
  console.log("Nothing to clean.");
  process.exit(0);
}

for (const target of targets) {
  console.log(`${dryRun ? "Would remove" : "Removing"} ${target}`);

  if (!dryRun) {
    await rm(toAbsolutePath(target), { force: true, recursive: true });
  }
}

if (dryRun) {
  console.log(`Dry run complete. ${targets.length} path(s) matched.`);
} else {
  console.log(`Clean complete. Removed ${targets.length} path(s).`);
}
