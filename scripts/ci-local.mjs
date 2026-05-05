import { exitWithFailures, ok, run } from "./lib/harness.mjs";

const checks = [
  ["check:env", ["run", "check:env"]],
  ["check:repo", ["run", "check:repo"]],
  ["test", ["test"]],
  ["check:plan", ["run", "check:plan"]],
  ["check:implementation", ["run", "check:implementation"]],
  ["compose:validate", ["run", "compose:validate"]],
  ["compose:validate:template", ["run", "compose:validate:template"]],
  ["sbom", ["run", "sbom"]],
  ["checksums", ["run", "checksums"]],
  ["bundle:offline", ["run", "bundle:offline"]],
  ["bundle:verify", ["run", "bundle:verify"]]
];

const failures = [];

for (const [name, args] of checks) {
  console.log(`\n== ${name} ==`);
  const result = run("npm", args, { stdio: "inherit" });
  if (result.status !== 0) {
    failures.push(`${name} failed`);
  }
}

exitWithFailures(failures);
ok("all harness checks passed");
