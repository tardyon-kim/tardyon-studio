import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

export const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

export function rel(path) {
  return relative(rootDir, path).replaceAll("\\", "/");
}

export function pathFromRoot(...parts) {
  return join(rootDir, ...parts);
}

export function ok(message) {
  console.log(`OK ${message}`);
}

export function warn(message) {
  console.warn(`WARN ${message}`);
}

export function fail(message) {
  console.error(`FAIL ${message}`);
}

export function run(command, args, options = {}) {
  const isWindowsCmd = process.platform === "win32" && ["npm", "npx"].includes(command);
  const executable = isWindowsCmd ? "cmd.exe" : command;
  const finalArgs = isWindowsCmd ? ["/d", "/s", "/c", `${command}.cmd`, ...args] : args;
  return spawnSync(executable, finalArgs, {
    cwd: options.cwd ?? rootDir,
    encoding: "utf8",
    shell: false,
    stdio: options.stdio ?? "pipe"
  });
}

export function commandExists(command, args = ["--version"]) {
  const result = run(command, args);
  return result.status === 0;
}

export function requireFiles(paths) {
  const missing = [];
  for (const item of paths) {
    if (!existsSync(pathFromRoot(item))) {
      missing.push(item);
    }
  }
  return missing;
}

export function listFiles(startDir, ignore = new Set([".git", "node_modules", "dist", ".next", "coverage"])) {
  const files = [];
  const walk = (dir) => {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (ignore.has(entry.name)) continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else {
        files.push(full);
      }
    }
  };
  walk(startDir);
  return files;
}

export function readText(path) {
  return readFileSync(path, "utf8");
}

export function sha256(path) {
  const hash = createHash("sha256");
  hash.update(readFileSync(path));
  return hash.digest("hex");
}

export function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

export function copyRecursive(src, dest) {
  const info = statSync(src);
  if (info.isDirectory()) {
    ensureDir(dest);
    for (const entry of readdirSync(src)) {
      copyRecursive(join(src, entry), join(dest, entry));
    }
  } else {
    ensureDir(dirname(dest));
    copyFileSync(src, dest);
  }
}

export function writeJson(path, data) {
  ensureDir(dirname(path));
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function exitWithFailures(failures) {
  if (failures.length > 0) {
    for (const item of failures) fail(item);
    process.exit(1);
  }
}
