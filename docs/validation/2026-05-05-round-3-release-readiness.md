# Round 3: Release Readiness Evidence

## Target

Validate that the harness produces and checks release evidence for offline/on-prem handoff without turning normal CI into a full product build pipeline.

## Core Intent Check

This round strengthens release confidence, not product behavior. It keeps product dependency installation, real builds, and container startup out of the default gate until a later ADR justifies them.

## Scope

In scope:

- SBOM coverage for all package manifests.
- Checksum coverage for starter deployment artifacts.
- Offline bundle manifest coverage for lifecycle docs, rubrics, scripts, and product starter artifacts.
- A `check:release-readiness` gate that runs after artifact generation.

Out of scope:

- Installing dependencies.
- Running `next build` or `tsc` across generated products.
- Starting Docker Compose services.
- Scanning images or dependencies with an external vulnerability scanner.

## Pass Criteria

- `npm run bundle:verify` passes before release-readiness validation.
- `npm run check:release-readiness` passes after SBOM/checksum/offline bundle generation and bundle verification.
- `npm run check` passes.
- Release readiness remains infrastructure and evidence oriented.

## Findings

| Finding | Status | Resolution |
|---------|--------|------------|
| SBOM-lite covered only the root package. | Fixed | SBOM now includes all package manifests in root apps, packages, and product starter. |
| Release readiness had no executable evidence gate. | Fixed | Added `scripts/check-release-readiness.mjs` and wired it after artifact generation. |
| Manual HARNESS command order initially listed readiness before evidence generation. | Fixed | Reordered manual commands to generate SBOM, checksums, bundle, and verification before readiness. |
| Checksum evidence used substring matching. | Fixed | Added exact checksum path parsing and SHA-256 recomputation for required template artifacts. |
| SBOM test initially wrote into the repository `dist` tree. | Fixed | Moved SBOM evidence test to a temp-root fixture via `HARNESS_ROOT_OVERRIDE`. |

## Independent Validation

Round 3 used independent validation passes after the first implementation pass:

| Reviewer | Initial Result | Final Result | Notes |
|----------|----------------|--------------|-------|
| Scope discipline | Failed | Passed | Fixed command order and kept heavy product gates out of default readiness. |
| Executable correctness | Failed | Passed | Fixed exact checksum matching and isolated SBOM tests from real release evidence. |
| Reliability | Failed | Passed | Fixed manual command order and checksum evidence exactness. |

## Verification Evidence

Fresh verification on 2026-05-05:

- `npm test` passed.
- `npm run check:implementation` passed.
- `npm run check` passed.

The local full check emitted a non-failing warning because this work ran on a feature branch instead of `main`, which is expected for the PR workflow.

## Follow-Up Candidates

- Add a heavy release profile for dependency install, build, typecheck, and container startup.
- Add real CycloneDX/SPDX SBOM generation.
- Add vulnerability scanning once the offline artifact strategy is clearer.
- Add image archive and image checksum evidence for closed-network transfer.
