import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { exitWithFailures, ok, pathFromRoot, readText } from "./lib/harness.mjs";

const explicit = process.argv[2];
const planPath = explicit
  ? pathFromRoot(explicit)
  : join(pathFromRoot("docs", "plans"), readdirSync(pathFromRoot("docs", "plans")).find((name) => name.endsWith(".md")) ?? "");

const failures = [];

if (!existsSync(planPath)) {
  failures.push(`plan file not found: ${explicit ?? "docs/plans/*.md"}`);
  exitWithFailures(failures);
}

const text = readText(planPath);
const requiredSections = [
  "# Enterprise Software Lifecycle Harness Plan",
  "## Problem Frame",
  "## Scope Boundaries",
  "## Key Decisions",
  "## Implementation Units",
  "## Plan Gate Criteria",
  "## Implementation Gate Criteria",
  "## Risks",
  "## Verification"
];

for (const section of requiredSections) {
  if (!text.includes(section)) failures.push(`missing plan section: ${section}`);
}

const requiredConcepts = [
  "Docker Compose",
  "offline",
  "PostgreSQL",
  "CI",
  "scripts",
  "ADR",
  "product-domain"
];

for (const concept of requiredConcepts) {
  if (!text.toLowerCase().includes(concept.toLowerCase())) {
    failures.push(`plan does not mention required concept: ${concept}`);
  }
}

exitWithFailures(failures);
ok(`plan gate passed for ${explicit ?? "default plan"}`);

