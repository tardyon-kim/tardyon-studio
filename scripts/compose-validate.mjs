import { exitWithFailures, ok, pathFromRoot, run } from "./lib/harness.mjs";

const composeFile = process.argv[2] ?? "ops/compose/docker-compose.yml";
const result = run("docker", ["compose", "-f", pathFromRoot(composeFile), "config"]);

if (result.status !== 0) {
  console.error(result.stdout);
  console.error(result.stderr);
  exitWithFailures([`docker compose config failed for ${composeFile}`]);
}

ok(`docker compose config passed for ${composeFile}`);
