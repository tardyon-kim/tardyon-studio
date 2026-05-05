import { existsSync, readFileSync, rmSync } from "node:fs";
import { basename, join } from "node:path";
import { exitWithFailures, listFiles, ok, pathFromRoot, rel, run } from "./lib/harness.mjs";
import {
  findCloudRuntimeDependencies,
  findMissingEnvKeys,
  findUnsafeOfflineEnvValues
} from "./lib/product-dry-run-rules.mjs";

const dryRunRelative = "dist/dry-run/generated-product";
const dryRunRoot = pathFromRoot(dryRunRelative);
const failures = [];

function requireGenerated(paths) {
  for (const item of paths) {
    const full = join(dryRunRoot, item);
    if (!existsSync(full)) failures.push(`generated product missing: ${item}`);
  }
}

function readGenerated(path) {
  return readFileSync(join(dryRunRoot, path), "utf8");
}

if (!rel(dryRunRoot).startsWith("dist/dry-run/")) {
  exitWithFailures([`refusing to clean unexpected dry-run path: ${dryRunRoot}`]);
}

rmSync(dryRunRoot, { recursive: true, force: true });

const init = run("node", ["scripts/init-product.mjs", dryRunRelative], { stdio: "pipe" });
if (init.status !== 0) {
  console.error(init.stdout);
  console.error(init.stderr);
  exitWithFailures(["product dry run failed during init-product"]);
}

requireGenerated([
  "README.md",
  "package.json",
  ".env.example",
  ".env.offline.example",
  "apps/web/package.json",
  "apps/api/package.json",
  "compose/docker-compose.yml",
  "docker/Dockerfile.web",
  "docker/Dockerfile.api",
  "db/migrations/.gitkeep",
  "ops/runbook.md"
]);

if (failures.length === 0) {
  const pkg = JSON.parse(readGenerated("package.json"));
  const expectedWorkspaces = ["apps/web", "apps/api"];
  if (JSON.stringify(pkg.workspaces) !== JSON.stringify(expectedWorkspaces)) {
    failures.push("generated product package.json workspaces must be apps/web and apps/api");
  }

  for (const script of ["build", "lint", "test", "typecheck", "compose:config"]) {
    if (!pkg.scripts?.[script]) failures.push(`generated product package.json missing script: ${script}`);
  }

  const readme = readGenerated("README.md");
  if (!readme.includes("Offline Rule")) failures.push("generated product README must include Offline Rule");

  const offlineEnv = readGenerated(".env.offline.example");
  if (!offlineEnv.includes("<set-inside-offline-environment>")) {
    failures.push("generated product offline env example must avoid baked-in secrets");
  }

  const runbook = readGenerated("ops/runbook.md");
  for (const section of ["## Backup", "## Restore", "## Upgrade", "## Rollback"]) {
    if (!runbook.includes(section)) failures.push(`generated product runbook missing ${section}`);
  }

  const compose = readGenerated("compose/docker-compose.yml");
  for (const missingKey of findMissingEnvKeys(compose, offlineEnv)) {
    failures.push(`generated product offline env missing compose variable: ${missingKey}`);
  }
  for (const unsafeValue of findUnsafeOfflineEnvValues(offlineEnv)) {
    failures.push(`generated product offline env unsafe value: ${unsafeValue}`);
  }

  const cloudRuntimePattern = /(amazonaws|azurewebsites|googleapis|cloudflare|supabase|neon\.tech|vercel\.app)/i;
  for (const file of listFiles(dryRunRoot)) {
    const content = readFileSync(file, "utf8");
    if (cloudRuntimePattern.test(content)) {
      failures.push(`generated product contains cloud runtime dependency hint: ${rel(file)}`);
    }
  }

  const packageFiles = listFiles(dryRunRoot)
    .filter((file) => basename(file) === "package.json")
    .map((file) => ({
      path: rel(file).replace(`${dryRunRelative}/`, ""),
      json: JSON.parse(readFileSync(file, "utf8"))
    }));
  for (const dependency of findCloudRuntimeDependencies(packageFiles)) {
    failures.push(`generated product contains cloud runtime package: ${dependency}`);
  }
}

exitWithFailures(failures);

const composeCheck = run(
  "docker",
  [
    "compose",
    "--env-file",
    join(dryRunRoot, ".env.offline.example"),
    "-f",
    join(dryRunRoot, "compose", "docker-compose.yml"),
    "config",
    "--format",
    "json"
  ],
  {
    stdio: "pipe",
    timeoutMs: 30000
  }
);
if (composeCheck.error) {
  exitWithFailures([`generated product docker compose config failed: ${composeCheck.error.message}`]);
}
if (composeCheck.status !== 0) {
  console.error(composeCheck.stdout);
  console.error(composeCheck.stderr);
  exitWithFailures(["generated product docker compose config failed"]);
}

const normalizedCompose = JSON.parse(composeCheck.stdout);
for (const service of ["postgres", "api", "web"]) {
  if (!normalizedCompose.services?.[service]) {
    failures.push(`generated product normalized compose missing service: ${service}`);
  }
}

exitWithFailures(failures);
ok(`generated product dry run passed at ${dryRunRelative}`);
