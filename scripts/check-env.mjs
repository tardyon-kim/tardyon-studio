import { commandExists, ok, warn, exitWithFailures } from "./lib/harness.mjs";

const failures = [];

const required = [
  ["git", ["--version"]],
  ["node", ["--version"]],
  ["npm", ["--version"]],
  ["docker", ["--version"]]
];

for (const [command, args] of required) {
  if (commandExists(command, args)) {
    ok(`${command} available`);
  } else {
    failures.push(`${command} is required`);
  }
}

if (commandExists("docker", ["compose", "version"])) {
  ok("docker compose available");
} else {
  warn("docker compose is unavailable; Compose checks will fail until Docker Compose is installed");
}

exitWithFailures(failures);

