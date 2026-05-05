import { ok, run, exitWithFailures } from "./lib/harness.mjs";

const provided = process.argv[2];
const current = provided ?? run("git", ["branch", "--show-current"]).stdout.trim();
const pattern = /^(main|(?:feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert|hotfix|release)\/[a-z0-9][a-z0-9._-]*[a-z0-9])$/;

if (pattern.test(current)) {
  ok(`branch name accepted: ${current}`);
} else {
  exitWithFailures([
    `branch name "${current}" does not follow Conventional Branches: type/short-description`
  ]);
}

