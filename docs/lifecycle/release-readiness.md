# Release Readiness

## Purpose

Release readiness verifies the evidence needed before an offline/on-prem handoff. It is stricter than the fast development gate, but it still avoids product-domain decisions.

## Fast Gate Versus Release-Readiness Gate

The fast gate proves the harness is coherent and repeatable during normal development.

The release-readiness gate proves the handoff evidence exists after the build scripts have generated it:

- SBOM-lite.
- Template checksums.
- Offline bundle manifest.
- Offline bundle checksum verification.
- Generated product dry-run evidence.
- Runbook, rollback, and operator handoff coverage.

## Non-Goals

- Installing product dependencies by default.
- Starting containers by default.
- Running product-specific workflows.
- Proving a business feature is useful.

Those checks can be added as heavier release profiles once the generated product path is proven.

## Required Command

Run after SBOM, checksums, bundle generation, and bundle verification:

```bash
npm run check:release-readiness
```

## Decision Rule

If a check requires network access, container startup, paid services, or a large dependency install, keep it out of the default release-readiness gate until an ADR explains why it belongs there.
