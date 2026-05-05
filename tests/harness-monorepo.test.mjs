import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
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
});
