# Enterprise Software Lifecycle Harness

## Purpose

This harness standardizes how to discover, plan, implement, verify, package, release, operate, and maintain enterprise software that must run in a fully offline/on-prem service environment.

Development may use internet access. Runtime service environments must not require it.

## Non-Goals

- This harness does not decide product domain behavior.
- This harness does not force every product to have the same screens, data model, or workflow.
- This harness does not implement Kubernetes in v1.
- This harness does not replace human approval for high-impact architecture, security, data, or operations decisions.

## Standard Path

1. Create or update the product strategy.
2. Create requirements.
3. Create architecture decisions and ADRs.
4. Create an implementation plan.
5. Run the plan gate.
6. Implement.
7. Run the implementation gate.
8. Package offline artifacts.
9. Verify the offline bundle.
10. Release with runbooks.
11. Capture learnings.

## Reference Monorepo

The harness includes a root reference monorepo:

- `apps/web` for the Next.js frontend reference path.
- `apps/api` for the NestJS backend reference path.
- `packages/shared` for shared contracts and utility types.
- `packages/config` for shared configuration conventions.
- `packages/db` for PostgreSQL migration and operational conventions.
- `ops/compose` for the Docker Compose deployment reference path.
- `ops/docker` for service Dockerfiles.
- `ops/runbooks` for operator-facing procedures.

The root reference implementation is the source of truth. Templates are derived from or kept aligned with this structure.

## Plan Gate

The plan gate checks whether the planned work is clear enough and safe enough to implement.

Minimum expectations:

- Problem frame and scope boundary are explicit.
- Product decisions are separated from infrastructure decisions.
- Required ADRs are identified.
- Docker Compose deployment impact is considered.
- Offline runtime assumptions are explicit.
- PostgreSQL or database exceptions are addressed.
- Security, observability, backup, restore, upgrade, and rollback are considered.
- Tests and CI checks are named before implementation starts.

Run:

```bash
npm run check:plan -- docs/plans/2026-05-05-001-harness-plan.md
```

## Implementation Gate

The implementation gate checks whether the repository actually satisfies the harness baseline.

Minimum expectations:

- Required docs exist.
- Required scripts exist.
- GitHub Actions CI exists.
- Product starter template exists.
- Docker Compose reference config is valid.
- Offline bundle can be generated and verified.
- No obvious secrets are committed.

Run:

```bash
npm run check:implementation
npm run compose:validate
npm run bundle:offline
npm run bundle:verify
```

## Evolution Model

v1 is intentionally a strong standard path:

- Docker Compose first.
- PostgreSQL first.
- Next.js/NestJS first.
- Scripts and CI first.

v2 may add:

- Product generator improvements.
- Policy-as-code checks.
- Kubernetes profile.
- Deeper SBOM and vulnerability tooling.
- More automated release packaging.
