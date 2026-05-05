import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { copyRecursive, ensureDir, listFiles, ok, pathFromRoot, rel, sha256, writeJson } from "./lib/harness.mjs";

const outDir = pathFromRoot("dist", "offline-bundle");
const bundleRoot = join(outDir, "tardyon-studio-harness");

if (existsSync(bundleRoot)) {
  rmSync(bundleRoot, { recursive: true, force: true });
}

ensureDir(bundleRoot);

const include = [
  "README.md",
  "AGENTS.md",
  "HARNESS.md",
  "STRATEGY.md",
  "docs",
  "apps",
  "packages",
  "ops",
  "scripts",
  "templates",
  ".compound-engineering/config.local.example.yaml",
  "package.json"
];

for (const item of include) {
  copyRecursive(pathFromRoot(item), join(bundleRoot, item));
}

const files = listFiles(bundleRoot);
const manifest = files.map((file) => ({
  path: rel(file).replace("dist/offline-bundle/tardyon-studio-harness/", ""),
  sha256: sha256(file)
})).sort((a, b) => a.path.localeCompare(b.path));

writeJson(join(outDir, "manifest.json"), {
  name: "tardyon-studio-harness",
  generatedAt: new Date().toISOString(),
  files: manifest
});

ok(`offline bundle created at ${rel(bundleRoot)}`);
ok(`manifest created at ${rel(join(outDir, "manifest.json"))}`);
