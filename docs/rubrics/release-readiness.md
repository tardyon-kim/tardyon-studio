# Release Readiness Rubric

## Pass Criteria

| Dimension | Pass Standard |
|-----------|---------------|
| SBOM | SBOM lists the root, reference apps, packages, and product starter package manifests. |
| Checksums | Checksum manifest includes product starter deployment artifacts. |
| Offline Bundle | Offline bundle manifest includes lifecycle docs, rubrics, scripts, and product starter artifacts. |
| Compose | Compose configuration has already validated in the same local/CI run. |
| Product Dry Run | Generated product dry run has already passed in the same local/CI run. |
| Runbook | Runbooks include backup, restore, upgrade, and rollback coverage. |
| Rollback | Release handoff includes rollback instructions or explicitly blocks release. |
| Scope | Gate avoids product-domain behavior and does not install dependencies or start services by default. |

## Failure Severity

| Severity | Meaning |
|----------|---------|
| Blocker | Missing SBOM, checksums, offline bundle, or rollback path. |
| High | Generated product or Compose evidence is missing. |
| Medium | Evidence exists but does not cover key starter artifacts. |
| Low | Documentation wording is unclear but evidence is present. |
