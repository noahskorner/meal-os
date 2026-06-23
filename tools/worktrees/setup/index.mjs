import { spawnSync } from "node:child_process";
import { mkdir, readdir, readFile, stat, copyFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const overwriteEnv = process.argv.includes("--overwrite-env");
const skipInstall = process.argv.includes("--skip-install");
const ignoredDirectoryNames = new Set([
  ".git",
  ".next",
  ".turbo",
  ".vercel",
  "android",
  "build",
  "coverage",
  "dist",
  "ios",
  "node_modules",
  "out",
  "playwright-report",
  "test-results",
  "web-build",
]);

function fail(message, details) {
  console.error(`worktree:setup failed: ${message}`);

  if (details) {
    console.error(details);
  }

  process.exit(1);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? rootDir,
    encoding: "utf8",
    shell: false,
    stdio: options.stdio ?? "pipe",
  });

  if (result.error) {
    fail(
      `Unable to run "${command} ${args.join(" ")}".`,
      "Make sure Git, Node.js, and npm are installed and available on PATH.",
    );
  }

  if (result.status !== 0) {
    fail(
      `"${command} ${args.join(" ")}" exited with status ${result.status}.`,
      [result.stdout, result.stderr].filter(Boolean).join("\n").trim(),
    );
  }

  return result.stdout;
}

async function pathExists(absolutePath) {
  try {
    await stat(absolutePath);
    return true;
  } catch {
    return false;
  }
}

function parseWorktrees(output) {
  const worktrees = [];
  let currentWorktree = undefined;

  for (const line of output.split(/\r?\n/)) {
    if (line.startsWith("worktree ")) {
      currentWorktree = { path: line.slice("worktree ".length), bare: false };
      worktrees.push(currentWorktree);
      continue;
    }

    if (line === "bare" && currentWorktree) {
      currentWorktree.bare = true;
    }
  }

  return worktrees;
}

function normalizeGitPath(gitPath) {
  return path.resolve(gitPath.replaceAll("/", path.sep));
}

function getPrimaryWorktreePath() {
  run("git", ["rev-parse", "--show-toplevel"]);

  const output = run("git", ["worktree", "list", "--porcelain"]);
  const worktrees = parseWorktrees(output).filter((worktree) => !worktree.bare);

  if (worktrees.length === 0) {
    fail("No non-bare Git worktrees were found.");
  }

  return normalizeGitPath(worktrees[0].path);
}

function isEnvFileName(fileName) {
  return fileName.startsWith(".env") && fileName !== ".env.example";
}

async function collectEnvFiles(sourceDir, relativeDir = ".") {
  const absoluteDir =
    relativeDir === "." ? sourceDir : path.join(sourceDir, relativeDir);
  const entries = await readdir(absoluteDir, { withFileTypes: true });
  const envFiles = [];

  for (const entry of entries) {
    const relativePath =
      relativeDir === "." ? entry.name : path.join(relativeDir, entry.name);

    if (entry.isDirectory()) {
      if (!ignoredDirectoryNames.has(entry.name)) {
        envFiles.push(...(await collectEnvFiles(sourceDir, relativePath)));
      }

      continue;
    }

    if (entry.isFile() && isEnvFileName(entry.name)) {
      envFiles.push(relativePath);
    }
  }

  return envFiles;
}

function isGitIgnored(sourceDir, relativePath) {
  const result = spawnSync("git", ["check-ignore", "-q", "--", relativePath], {
    cwd: sourceDir,
    encoding: "utf8",
    shell: false,
    stdio: "pipe",
  });

  if (result.status === 0) {
    return true;
  }

  if (result.status === 1) {
    return false;
  }

  fail(
    `Unable to determine whether "${relativePath}" is ignored by Git.`,
    result.stderr.trim(),
  );
}

async function filesMatch(leftPath, rightPath) {
  if (!(await pathExists(rightPath))) {
    return false;
  }

  const [left, right] = await Promise.all([
    readFile(leftPath),
    readFile(rightPath),
  ]);
  return left.equals(right);
}

async function copyIgnoredEnvFiles(sourceDir) {
  if (sourceDir === rootDir) {
    console.log(
      "Primary worktree is the current directory. Skipping env file copy.",
    );
    return;
  }

  const envFiles = (await collectEnvFiles(sourceDir)).filter((relativePath) =>
    isGitIgnored(sourceDir, relativePath),
  );

  if (envFiles.length === 0) {
    console.log("No ignored .env* files found in the primary worktree.");
    return;
  }

  let copiedCount = 0;
  let skippedCount = 0;

  for (const relativePath of envFiles.sort((left, right) =>
    left.localeCompare(right),
  )) {
    const sourcePath = path.join(sourceDir, relativePath);
    const targetPath = path.join(rootDir, relativePath);

    if (!overwriteEnv && (await pathExists(targetPath))) {
      if (await filesMatch(sourcePath, targetPath)) {
        console.log(`Env file already current: ${relativePath}`);
      } else {
        console.log(`Env file exists, leaving unchanged: ${relativePath}`);
      }

      skippedCount += 1;
      continue;
    }

    await mkdir(path.dirname(targetPath), { recursive: true });
    await copyFile(sourcePath, targetPath);
    console.log(`Copied env file: ${relativePath}`);
    copiedCount += 1;
  }

  console.log(
    `Env file copy complete. Copied ${copiedCount}, skipped ${skippedCount}.`,
  );
}

function installDependencies() {
  const hasPackageLock =
    spawnSync("git", ["ls-files", "--error-unmatch", "package-lock.json"], {
      cwd: rootDir,
      encoding: "utf8",
      shell: false,
      stdio: "pipe",
    }).status === 0;
  const installArgs = hasPackageLock ? ["ci"] : ["install"];
  const npmExecPath = process.env.npm_execpath;

  console.log(`Installing dependencies with npm ${installArgs.join(" ")}...`);

  if (npmExecPath) {
    run(process.execPath, [npmExecPath, ...installArgs], { stdio: "inherit" });
    return;
  }

  run("npm", installArgs, {
    shell: process.platform === "win32",
    stdio: "inherit",
  });
}

console.log("Preparing Git worktree for development...");

const primaryWorktreePath = getPrimaryWorktreePath();
console.log(`Primary worktree: ${primaryWorktreePath}`);
console.log(`Target worktree: ${rootDir}`);

await copyIgnoredEnvFiles(primaryWorktreePath);

if (skipInstall) {
  console.log(
    "Skipping dependency installation because --skip-install was provided.",
  );
} else {
  installDependencies();
}

console.log("Worktree setup complete.");
console.log(
  "You can now make changes, run builds, run tests, and commit from this worktree.",
);
