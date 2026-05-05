import { existsSync } from "node:fs";
import { join } from "node:path";
import { exitWithFailures, ok, pathFromRoot, readText, sha256 } from "./lib/harness.mjs";
import { parseChecksumEntries } from "./lib/release-readiness-rules.mjs";

const failures = [];

const sbomPath = pathFromRoot("dist", "sbom", "sbom-lite.json");
const checksumPath = pathFromRoot("dist", "checksums", "SHA256SUMS.txt");
const bundleManifestPath = pathFromRoot("dist", "offline-bundle", "manifest.json");

for (const [label, path] of [
  ["SBOM", sbomPath],
  ["checksum manifest", checksumPath],
  ["offline bundle manifest", bundleManifestPath]
]) {
  if (!existsSync(path)) failures.push(`missing release evidence: ${label}`);
}

if (failures.length > 0) exitWithFailures(failures);

const sbom = JSON.parse(readText(sbomPath));
const componentPaths = new Set((sbom.components ?? []).map((component) => component.path));
const requiredPackagePaths = [
  "package.json",
  "apps/web/package.json",
  "apps/api/package.json",
  "packages/shared/package.json",
  "packages/config/package.json",
  "packages/db/package.json",
  "templates/product-starter/package.json",
  "templates/product-starter/apps/web/package.json",
  "templates/product-starter/apps/api/package.json"
];

for (const path of requiredPackagePaths) {
  if (!componentPaths.has(path)) failures.push(`SBOM missing component package: ${path}`);
}

const checksumEntries = parseChecksumEntries(readText(checksumPath));
for (const path of [
  "templates/product-starter/.env.offline.example",
  "templates/product-starter/compose/docker-compose.yml",
  "templates/product-starter/docker/Dockerfile.api",
  "templates/product-starter/docker/Dockerfile.web",
  "templates/product-starter/ops/runbook.md"
]) {
  const checksum = checksumEntries.get(path);
  if (!checksum) {
    failures.push(`checksum manifest missing template artifact: ${path}`);
  } else if (existsSync(pathFromRoot(path)) && sha256(pathFromRoot(path)) !== checksum) {
    failures.push(`checksum manifest hash mismatch for template artifact: ${path}`);
  }
}

const bundleManifest = JSON.parse(readText(bundleManifestPath));
const bundlePaths = new Set((bundleManifest.files ?? []).map((file) => file.path));
for (const path of [
  "HARNESS.md",
  "docs/lifecycle/release-readiness.md",
  "docs/rubrics/release-readiness.md",
  "docs/validation/README.md",
  "scripts/check-release-readiness.mjs",
  "scripts/check-product-dry-run.mjs",
  "templates/product-starter/.env.offline.example",
  "templates/product-starter/compose/docker-compose.yml"
]) {
  if (!bundlePaths.has(path)) failures.push(`offline bundle missing release-readiness path: ${path}`);
}

for (const [label, path, phrases] of [
  ["release lifecycle", pathFromRoot("docs", "lifecycle", "release.md"), ["Offline artifact bundle", "SBOM", "Checksum", "Release readiness"]],
  ["release readiness lifecycle", pathFromRoot("docs", "lifecycle", "release-readiness.md"), ["fast gate", "release-readiness gate", "offline/on-prem"]],
  ["release readiness rubric", pathFromRoot("docs", "rubrics", "release-readiness.md"), ["SBOM", "checksums", "offline bundle", "rollback"]]
]) {
  const text = readText(path);
  for (const phrase of phrases) {
    if (!text.toLowerCase().includes(phrase.toLowerCase())) {
      failures.push(`${label} missing phrase: ${phrase}`);
    }
  }
}

if (!existsSync(join(pathFromRoot("dist", "offline-bundle"), "tardyon-studio-harness"))) {
  failures.push("offline bundle directory missing for release readiness");
}

exitWithFailures(failures);
ok("release readiness evidence gate passed");
