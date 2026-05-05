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
});
