import { ok, warn, run, exitWithFailures } from "./lib/harness.mjs";

const failures = [];

const inside = run("git", ["rev-parse", "--is-inside-work-tree"]);
if (inside.status !== 0 || inside.stdout.trim() !== "true") {
  failures.push("repository must be initialized with git");
} else {
  ok("git repository initialized");
}

const branch = run("git", ["branch", "--show-current"]);
if (branch.status === 0 && branch.stdout.trim() === "main") {
  ok("current branch is main");
} else {
  warn(`current branch is ${branch.stdout.trim() || "unknown"}; trunk branch should be main`);
}

const remote = run("git", ["remote", "get-url", "origin"]);
if (remote.status === 0) {
  const url = remote.stdout.trim();
  if (url.includes("github.com")) {
    ok("origin remote points to GitHub");
  } else {
    warn(`origin remote is not clearly GitHub: ${url}`);
  }
} else {
  warn("origin remote is not configured yet; configure a public GitHub repository before collaboration");
}

exitWithFailures(failures);

