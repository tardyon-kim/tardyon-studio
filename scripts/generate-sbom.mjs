import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname } from "node:path";
import { listFiles, ok, pathFromRoot, rel } from "./lib/harness.mjs";

const pkgPath = pathFromRoot("package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const out = pathFromRoot("dist", "sbom", "sbom-lite.json");
const packageFiles = listFiles(pathFromRoot())
  .filter((file) => basename(file) === "package.json")
  .sort((a, b) => rel(a).localeCompare(rel(b)));

const components = packageFiles.map((file) => {
  const data = JSON.parse(readFileSync(file, "utf8"));
  return {
    name: data.name,
    version: data.version,
    type: data.private ? "application" : "library",
    path: rel(file),
    dependencies: Object.entries(data.dependencies ?? {}).map(([name, version]) => ({ name, version })),
    devDependencies: Object.entries(data.devDependencies ?? {}).map(([name, version]) => ({ name, version }))
  };
});

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
  devDependencies: Object.keys(pkg.devDependencies ?? {}).map((name) => ({ name, version: pkg.devDependencies[name] })),
  components
}, null, 2)}\n`);

if (!existsSync(out)) process.exit(1);
ok(`SBOM-lite generated at ${rel(out)}`);
