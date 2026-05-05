# Round 1: Harness Coherence Validation

## Target

Validate that the v1 harness is an integrated enterprise lifecycle system rather than an accidental merge of Compound Engineering, Superpowers, and gstack.

## Scope

In scope:

- Toolchain role clarity.
- Harness versus product-domain boundary.
- Plan validation versus implementation validation.
- Executable local and CI checks.
- Offline/on-prem baseline preservation.

Out of scope:

- Building a real business product.
- Installing gstack as a mandatory dependency.
- Adding Kubernetes.
- Replacing the current Docker Compose reference path.

## Findings

| Finding | Status | Resolution |
|---------|--------|------------|
| gstack role was documented only briefly in `AGENTS.md`. | Fixed | Added `docs/lifecycle/toolchain-integration.md`. |
| Harness coherence did not have a dedicated rubric. | Fixed | Added `docs/rubrics/harness-coherence.md`. |
| Toolchain integration was not an executable gate. | Fixed | Added `npm run check:toolchain` and wired it into local/CI checks. |
| Dated validation records were initially required as a permanent baseline. | Fixed | Required `docs/validation/README.md` instead, keeping round records as evidence. |
| gstack wording initially invited product-scope critique. | Fixed | Narrowed the wording to harness adoption and architecture critique. |
| Missing toolchain files could produce an unhandled `ENOENT`. | Fixed | The toolchain check now exits with actionable failure messages before reading required files. |

## Independent Validation

Round 1 used independent validation passes after the first implementation pass:

| Reviewer | Initial Result | Final Result | Notes |
|----------|----------------|--------------|-------|
| Document coherence | Failed | Passed | Fixed corrupted wording, role/provenance wording, and gstack future-decision ambiguity. |
| Scope discipline | Failed | Passed | Removed dated-report permanence and product-scope gstack wording. |
| Executable correctness | Failed | Passed | Added missing-file regression coverage and clean failure handling. |

## Pass Criteria

- Toolchain roles are documented. Passed.
- gstack remains optional and bounded. Passed.
- Harness coherence has a reusable rubric. Passed.
- `npm run check:toolchain` passes. Passed.
- `npm run check` passes. Passed.

## Verification Evidence

Fresh verification on 2026-05-05:

- `npm test` passed.
- `npm run check:toolchain` passed.
- `npm run check:implementation` passed.
- `npm run check` passed.

The local full check emitted a non-failing warning because the validation work ran on `codex/harness-validation-round-1` instead of `main`, which is expected for the PR workflow.

## Follow-Up Candidates

- Round 2 should run a generated product dry run and verify the product starter lifecycle.
- Round 3 should strengthen offline release evidence with deeper SBOM and vulnerability tooling.
- A later round can decide whether gstack remains optional, gains stricter invocation criteria, or becomes required for specific high-risk review classes.
