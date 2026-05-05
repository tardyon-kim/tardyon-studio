import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { ok, pathFromRoot, rel } from "./lib/harness.mjs";

const pkgPath = pathFromRoot("package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const out = pathFromRoot("dist", "sbom", "sbom-lite.json");

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify({
  bomFormat: "CycloneDX-lite",
  generatedAt: new Date().toISOString(),
  component: {
    name: pkg.name,
    version: pkg.version,
    type: "application"
  },
  dependencies: Object.keys(pkg.dependencies ?? {}).map((name) => ({ name, version: pkg.dependencies[name] })),
  devDependencies: Object.keys(pkg.devDependencies ?? {}).map((name) => ({ name, version: pkg.devDependencies[name] }))
}, null, 2)}\n`);

if (!existsSync(out)) process.exit(1);
ok(`SBOM-lite generated at ${rel(out)}`);

