import { ok, run, exitWithFailures } from "./lib/harness.mjs";

const message = process.argv.slice(2).join(" ") || run("git", ["log", "-1", "--pretty=%B"]).stdout.trim();
const pattern = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9._-]+\))?!?: .{1,120}/m;

if (!message) {
  ok("no commit message to validate yet");
} else if (pattern.test(message)) {
  ok("commit message follows Conventional Commits");
} else {
  exitWithFailures([
    `commit message does not follow Conventional Commits: ${message.split("\n")[0]}`
  ]);
}

