# Round 2: Generated Product Dry Run

## Target

Validate that the harness can generate a product workspace and then verify the generated workspace without choosing a product domain.

## Core Intent Check

This round does not decide what product to build. It checks whether the harness can create a reusable starting point for many offline/on-prem enterprise services.

## Scope

In scope:

- Running `init-product` into a temporary dry-run directory.
- Checking generated product structure.
- Checking generated product scripts.
- Checking Docker Compose configuration for the generated product.
- Checking offline environment and runbook placeholders.
- Wiring the dry run into local and CI gates.

Out of scope:

- Installing product dependencies.
- Building real Next.js or NestJS artifacts.
- Starting containers.
- Choosing screens, workflows, domain models, or product behavior.

## Findings

| Finding | Status | Resolution |
|---------|--------|------------|
| The harness validated the template but not a generated product workspace. | Fixed | Added `scripts/check-product-dry-run.mjs`. |
| Product generation was not part of the full local/CI gate. | Fixed | Added `npm run check:product-dry-run` and wired it into `npm run check` and GitHub Actions. |
| Dated Round 2 records were initially tied to permanent implementation checks. | Fixed | Kept the dated record as evidence only; the durable gate is `check:product-dry-run`. |
| Offline env readiness could false-pass. | Fixed | The dry-run gate compares Compose variables to `.env.offline.example` and validates Compose with the offline env file. |
| Cloud runtime dependencies could evade hostname checks. | Fixed | Added structured package dependency denylist checks for common cloud SDKs. |
| Compose validation could hang without a bounded timeout. | Fixed | Added timeout handling to generated product and shared Compose validation checks. |
| Compose service checks used raw text. | Fixed | The dry-run gate now verifies normalized Compose services from `docker compose config --format json`. |

## Independent Validation

Round 2 used independent validation passes after the first implementation pass:

| Reviewer | Initial Result | Final Result | Notes |
|----------|----------------|--------------|-------|
| Scope discipline | Failed | Passed | Removed dated validation record from permanent gates and kept product-domain behavior out of scope. |
| Executable correctness | Failed | Passed | Added reusable rule coverage, CI wiring checks, cloud SDK denylist coverage, and Compose interpolation coverage. |
| Reliability | Failed | Passed | Validated offline env coverage, cloud dependency detection, Compose timeout, and normalized Compose services. |

## Pass Criteria

- `init-product` creates a product workspace in `dist/dry-run/generated-product`.
- The generated workspace contains frontend, backend, compose, docker, env, db, and runbook files.
- The generated package declares expected scripts.
- The generated Docker Compose config validates.
- Offline env and runbook placeholders exist.
- No obvious cloud runtime dependency hint appears in the generated product.
- `npm run check:product-dry-run` passes. Passed.
- `npm run check` passes. Passed.

## Verification Evidence

Fresh verification on 2026-05-05:

- `npm test` passed.
- `npm run check:product-dry-run` passed.
- `npm run compose:validate` passed.
- `npm run compose:validate:template` passed.
- `npm run check:implementation` passed.
- `npm run check` passed.

The local full check emitted a non-failing warning because this work ran on a feature branch instead of `main`, which is expected for the PR workflow.

## Follow-Up Candidates

- Round 3 should decide whether dependency installation and real `build/typecheck` belong in the default CI gate or a heavier release-readiness gate.
- Future rounds should add stronger offline image, SBOM, vulnerability, backup/restore, and migration evidence.
