import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

function fromRoot(...parts) {
  return join(root, ...parts);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

describe("reference monorepo harness", () => {
  it("declares root workspaces for reference apps and packages", () => {
    const pkg = readJson(fromRoot("package.json"));

    assert.deepEqual(pkg.workspaces, [
      "apps/*",
      "packages/*"
    ]);
  });

  it("contains the root reference implementation structure", () => {
    const requiredPaths = [
      "apps/web/package.json",
      "apps/api/package.json",
      "packages/shared/package.json",
      "packages/config/package.json",
      "packages/db/package.json",
      "ops/compose/docker-compose.yml",
      "ops/docker/Dockerfile.web",
      "ops/docker/Dockerfile.api",
      "ops/runbooks/reference-runbook.md"
    ];

    for (const path of requiredPaths) {
      assert.equal(existsSync(fromRoot(path)), true, `missing ${path}`);
    }
  });

  it("keeps the template starter aligned to the reference monorepo", () => {
    const rootCompose = readFileSync(fromRoot("ops/compose/docker-compose.yml"), "utf8");
    const templateCompose = readFileSync(fromRoot("templates/product-starter/compose/docker-compose.yml"), "utf8");

    for (const service of ["postgres:", "api:", "web:"]) {
      assert.match(rootCompose, new RegExp(service));
      assert.match(templateCompose, new RegExp(service));
    }
  });

  it("documents the integrated toolchain roles and coherence gate", () => {
    const toolchainPath = fromRoot("docs/lifecycle/toolchain-integration.md");
    const coherencePath = fromRoot("docs/rubrics/harness-coherence.md");
    const pkg = readJson(fromRoot("package.json"));

    assert.equal(existsSync(toolchainPath), true, "missing toolchain integration lifecycle doc");
    assert.equal(existsSync(coherencePath), true, "missing harness coherence rubric");
    assert.equal(pkg.scripts["check:toolchain"], "node scripts/check-toolchain-integration.mjs");

    const toolchain = readFileSync(toolchainPath, "utf8");
    const coherence = readFileSync(coherencePath, "utf8");

    for (const phrase of [
      "Compound Engineering",
      "Superpowers",
      "gstack",
      "Core",
      "Safety",
      "Optional Specialist"
    ]) {
      assert.match(toolchain, new RegExp(phrase));
    }

    for (const phrase of [
      "Harness Coherence",
      "product-domain",
      "plan validation",
      "implementation validation",
      "offline/on-prem"
    ]) {
      assert.match(coherence, new RegExp(phrase, "i"));
    }
  });

  it("reports missing toolchain files without throwing a stack trace", () => {
    const tempRoot = mkdtempSync(join(tmpdir(), "harness-toolchain-missing-"));

    try {
      mkdirSync(join(tempRoot, "docs", "lifecycle"), { recursive: true });
      mkdirSync(join(tempRoot, "docs", "rubrics"), { recursive: true });
      mkdirSync(join(tempRoot, "docs", "validation"), { recursive: true });
      writeFileSync(join(tempRoot, "AGENTS.md"), "", "utf8");
      writeFileSync(join(tempRoot, "HARNESS.md"), "", "utf8");
      writeFileSync(join(tempRoot, "package.json"), JSON.stringify({ scripts: {} }), "utf8");

      const result = spawnSync(process.execPath, [fromRoot("scripts/check-toolchain-integration.mjs")], {
        cwd: tempRoot,
        encoding: "utf8",
        env: {
          ...process.env,
          HARNESS_ROOT_OVERRIDE: tempRoot
        }
      });

      assert.equal(result.status, 1);
      assert.match(result.stderr, /missing toolchain integration file/);
      assert.doesNotMatch(result.stderr, /ENOENT/);
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it("declares a generated product dry-run gate", () => {
    const pkg = readJson(fromRoot("package.json"));
    const scriptPath = fromRoot("scripts/check-product-dry-run.mjs");
    const ciLocal = readFileSync(fromRoot("scripts/ci-local.mjs"), "utf8");
    const workflow = readFileSync(fromRoot(".github/workflows/ci.yml"), "utf8");
    const implementationCheck = readFileSync(fromRoot("scripts/check-implementation.mjs"), "utf8");
    const validationIndex = readFileSync(fromRoot("docs/validation/README.md"), "utf8");

    assert.equal(pkg.scripts["check:product-dry-run"], "node scripts/check-product-dry-run.mjs");
    assert.equal(existsSync(scriptPath), true, "missing product dry-run check script");
    assert.match(ciLocal, /check:product-dry-run/);
    assert.match(workflow, /check:product-dry-run/);
    assert.match(validationIndex, /Generated product dry run/);
    assert.doesNotMatch(implementationCheck, /2026-05-05-round-2-product-dry-run\.md/);
  });

  it("defines reusable product dry-run validation rules", async () => {
    const rules = await import("../scripts/lib/product-dry-run-rules.mjs");
    const compose = [
      "environment:",
      "  POSTGRES_DB: ${POSTGRES_DB:-app}",
      "  DATABASE_URL: ${DATABASE_URL}",
      "  REQUIRED_VALUE: ${REQUIRED_VALUE?set it}",
      "  DASH_DEFAULT: ${DASH_DEFAULT-local}",
      "  PLUS_VALUE: ${PLUS_VALUE+enabled}",
      "  COLON_PLUS_VALUE: ${COLON_PLUS_VALUE:+enabled}",
      "ports:",
      "  - \"${WEB_PORT:-3000}:3000\"",
      "healthcheck:",
      "  test: [\"CMD-SHELL\", \"echo $${ESCAPED_VAR:-ignored}\"]"
    ].join("\n");
    const env = [
      "# comment",
      "POSTGRES_DB=app",
      "DATABASE_URL=postgresql://app:<set-inside-offline-environment>@postgres:5432/app",
      "REQUIRED_VALUE=yes",
      "DASH_DEFAULT=local",
      "PLUS_VALUE=enabled",
      "COLON_PLUS_VALUE=enabled",
      "WEB_PORT=3000"
    ].join("\n");
    const packages = [
      {
        path: "package.json",
        json: {
          dependencies: {
            "@aws-sdk/client-s3": "latest",
            "firebase-admin": "latest",
            "aws-amplify": "latest",
            react: "latest"
          },
          devDependencies: {
            "@google-cloud/storage": "latest",
            "@aws-amplify/auth": "latest"
          }
        }
      }
    ];

    assert.deepEqual([...rules.collectComposeVariables(compose)].sort(), [
      "COLON_PLUS_VALUE",
      "DASH_DEFAULT",
      "DATABASE_URL",
      "PLUS_VALUE",
      "POSTGRES_DB",
      "REQUIRED_VALUE",
      "WEB_PORT"
    ]);
    assert.deepEqual([...rules.parseEnvKeys(env)].sort(), [
      "COLON_PLUS_VALUE",
      "DASH_DEFAULT",
      "DATABASE_URL",
      "PLUS_VALUE",
      "POSTGRES_DB",
      "REQUIRED_VALUE",
      "WEB_PORT"
    ]);
    assert.deepEqual(rules.findMissingEnvKeys(compose, env), []);
    assert.deepEqual(rules.findCloudRuntimeDependencies(packages), [
      "package.json dependency @aws-sdk/client-s3",
      "package.json dependency firebase-admin",
      "package.json dependency aws-amplify",
      "package.json devDependency @google-cloud/storage",
      "package.json devDependency @aws-amplify/auth"
    ]);
  });
});
