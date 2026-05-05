import { readFileSync } from "node:fs";
import { exitWithFailures, ok, pathFromRoot, readText, requireFiles } from "./lib/harness.mjs";

const failures = [];

const requiredFiles = [
  "package.json",
  "AGENTS.md",
  "HARNESS.md",
  "docs/lifecycle/toolchain-integration.md",
  "docs/rubrics/harness-coherence.md",
  "docs/validation/README.md"
];

for (const missing of requireFiles(requiredFiles)) {
  failures.push(`missing toolchain integration file: ${missing}`);
}

exitWithFailures(failures);

const docs = {
  agents: readText(pathFromRoot("AGENTS.md")),
  harness: readText(pathFromRoot("HARNESS.md")),
  toolchain: readText(pathFromRoot("docs/lifecycle/toolchain-integration.md")),
  coherence: readText(pathFromRoot("docs/rubrics/harness-coherence.md")),
  validation: readText(pathFromRoot("docs/validation/README.md"))
};

const requiredRolePhrases = [
  ["AGENTS.md", docs.agents, "Compound Engineering is the primary lifecycle workflow"],
  ["AGENTS.md", docs.agents, "Superpowers is the safety workflow"],
  ["AGENTS.md", docs.agents, "gstack is optional"],
  ["toolchain integration", docs.toolchain, "Compound Engineering | Core lifecycle workflow"],
  ["toolchain integration", docs.toolchain, "Superpowers | Safety workflow"],
  ["toolchain integration", docs.toolchain, "gstack | Optional Specialist workflow"],
  ["toolchain integration", docs.toolchain, "Plan Validation"],
  ["toolchain integration", docs.toolchain, "Implementation Validation"],
  ["harness coherence", docs.coherence, "Harness Coherence"],
  ["harness coherence", docs.coherence, "product-domain"],
  ["harness coherence", docs.coherence, "offline/on-prem"],
  ["validation index", docs.validation, "gstack remains optional"]
];

for (const [label, text, phrase] of requiredRolePhrases) {
  if (!text.includes(phrase)) {
    failures.push(`${label} missing phrase: ${phrase}`);
  }
}

const pkg = JSON.parse(readFileSync(pathFromRoot("package.json"), "utf8"));
if (pkg.scripts?.["check:toolchain"] !== "node scripts/check-toolchain-integration.mjs") {
  failures.push("package.json missing check:toolchain script");
}

if (!docs.toolchain.includes("gstack is not a required v1 dependency")) {
  failures.push("toolchain integration must keep gstack optional in v1");
}

if (!docs.coherence.includes("plan validation and implementation validation are separate")) {
  failures.push("harness coherence rubric must keep plan and implementation validation separate");
}

exitWithFailures(failures);
ok("toolchain integration gate passed");
