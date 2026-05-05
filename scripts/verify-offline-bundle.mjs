import { existsSync } from "node:fs";
import { join } from "node:path";
import { exitWithFailures, ok, pathFromRoot, readText, sha256 } from "./lib/harness.mjs";

const outDir = pathFromRoot("dist", "offline-bundle");
const bundleRoot = join(outDir, "tardyon-studio-harness");
const manifestPath = join(outDir, "manifest.json");
const failures = [];

if (!existsSync(manifestPath)) failures.push("offline bundle manifest does not exist");
if (!existsSync(bundleRoot)) failures.push("offline bundle directory does not exist");
if (failures.length) exitWithFailures(failures);

const manifest = JSON.parse(readText(manifestPath));
for (const item of manifest.files ?? []) {
  const file = join(bundleRoot, item.path);
  if (!existsSync(file)) {
    failures.push(`bundle file missing: ${item.path}`);
  } else if (sha256(file) !== item.sha256) {
    failures.push(`checksum mismatch: ${item.path}`);
  }
}

exitWithFailures(failures);
ok("offline bundle verification passed");

