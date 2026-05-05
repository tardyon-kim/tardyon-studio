# Release Stage

## Purpose

Package and hand off a versioned artifact for offline/on-prem deployment.

## Inputs

- Verified implementation.
- Release notes.
- Migration notes.

## Outputs

- Offline artifact bundle.
- SBOM.
- Checksum manifest.
- Release notes.
- Upgrade and rollback instructions.

## Gate

Release only when the offline bundle can be verified independently.

Run the Release readiness gate after SBOM, checksums, offline bundle generation, and bundle verification:

```bash
npm run check:release-readiness
```
