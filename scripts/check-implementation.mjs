import { readFileSync } from "node:fs";
import { exitWithFailures, listFiles, ok, pathFromRoot, readText, requireFiles } from "./lib/harness.mjs";

const failures = [];

const requiredFiles = [
  "README.md",
  "AGENTS.md",
  "HARNESS.md",
  "STRATEGY.md",
  ".github/workflows/ci.yml",
  "apps/web/package.json",
  "apps/api/package.json",
  "packages/shared/package.json",
  "packages/config/package.json",
  "packages/db/package.json",
  "ops/compose/docker-compose.yml",
  "ops/docker/Dockerfile.web",
  "ops/docker/Dockerfile.api",
  "ops/runbooks/reference-runbook.md",
  "docs/plans/2026-05-05-001-harness-plan.md",
  "docs/lifecycle/discovery.md",
  "docs/lifecycle/strategy.md",
  "docs/lifecycle/requirements.md",
  "docs/lifecycle/architecture.md",
  "docs/lifecycle/implementation.md",
  "docs/lifecycle/verification.md",
  "docs/lifecycle/release.md",
  "docs/lifecycle/operations.md",
  "docs/lifecycle/maintenance.md",
  "docs/lifecycle/toolchain-integration.md",
  "docs/templates/idea-brief.md",
  "docs/templates/product-strategy.md",
  "docs/templates/prd.md",
  "docs/templates/srs.md",
  "docs/templates/sdd.md",
  "docs/templates/adr.md",
  "docs/templates/test-plan.md",
  "docs/templates/runbook.md",
  "docs/rubrics/enterprise-readiness.md",
  "docs/rubrics/architecture-review.md",
  "docs/rubrics/security-review.md",
  "docs/rubrics/maintainability-review.md",
  "docs/rubrics/harness-coherence.md",
  "docs/validation/README.md",
  "docs/playbooks/new-product.md",
  "scripts/check-env.mjs",
  "scripts/check-toolchain-integration.mjs",
  "scripts/check-plan.mjs",
  "scripts/check-implementation.mjs",
  "scripts/make-offline-bundle.mjs",
  "scripts/verify-offline-bundle.mjs",
  "templates/product-starter/package.json",
  "templates/product-starter/compose/docker-compose.yml",
  "templates/product-starter/apps/web/package.json",
  "templates/product-starter/apps/web/postcss.config.mjs",
  "templates/product-starter/apps/web/tailwind.config.ts",
  "templates/product-starter/apps/api/package.json"
];

for (const missing of requireFiles(requiredFiles)) {
  failures.push(`missing required file: ${missing}`);
}

const pkg = JSON.parse(readFileSync(pathFromRoot("package.json"), "utf8"));
const scripts = pkg.scripts ?? {};
const requiredScripts = [
  "check",
  "check:env",
  "check:repo",
  "check:toolchain",
  "check:plan",
  "check:implementation",
  "compose:validate",
  "bundle:offline",
  "bundle:verify",
  "init:product",
  "test"
];

for (const script of requiredScripts) {
  if (!scripts[script]) failures.push(`missing package script: ${script}`);
}

const agentRules = readText(pathFromRoot("AGENTS.md"));
for (const phrase of ["Compound Engineering", "Superpowers", "Docker Compose", "No work is complete"]) {
  if (!agentRules.includes(phrase)) failures.push(`AGENTS.md missing phrase: ${phrase}`);
}

const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH |)?PRIVATE KEY-----/,
  /AKIA[0-9A-Z]{16}/,
  /OPENAI_API_KEY\s*=\s*sk-/,
  /password\s*=\s*[^<\s].{8,}/i
];

for (const file of listFiles(pathFromRoot())) {
  const relative = file.replace(pathFromRoot(), "").replaceAll("\\", "/");
  if (relative.includes("/templates/product-starter/.env.example")) continue;
  const content = readText(file);
  for (const pattern of secretPatterns) {
    if (pattern.test(content)) {
      failures.push(`possible secret pattern in ${relative}`);
    }
  }
}

exitWithFailures(failures);
ok("implementation gate passed");
