# Agent Rules

This repository is an enterprise software lifecycle harness. It is not a product repo.

## Primary Goal

Help create and evolve a repeatable harness for building software that is developed with internet access but deployed and operated in fully offline/on-prem environments.

## Tool Roles

- Compound Engineering is the primary lifecycle workflow for strategy, brainstorming, planning, work execution, debugging, review, and compounding learnings.
- Superpowers is the safety workflow for TDD, systematic debugging, verification before completion, and disciplined planning.
- gstack is optional and should be used only for specialist QA, design review, security review, browser checks, release assistance, or second-opinion review.
- GitHub Actions is the required CI gate for pull requests.

## Workflow Rules

1. Separate plan validation from implementation validation.
2. Do not implement from an unvalidated plan unless the user explicitly asks for a spike.
3. Do not claim work is complete without running the relevant verification scripts.
4. Keep product-domain choices out of the harness unless they are reusable infrastructure or operating constraints.
5. Strongly standardize infrastructure-level decisions.
6. Keep product behavior, domain model, and user workflows product-specific.

## Harness Defaults

- GitHub public repository on the free plan.
- Trunk-based development.
- Conventional Branches.
- Conventional Commits.
- Pull requests only.
- Squash Merge.
- Docker Compose deployment reference path.
- PostgreSQL reference database.
- Next.js + TypeScript + shadcn/ui-compatible FSD frontend reference path.
- NestJS + TypeScript backend reference path.

## Exception Policy

Exceptions are allowed only when captured in an ADR and validated through the same offline/on-prem gates.

Examples:

- FastAPI instead of NestJS.
- InfluxDB in addition to PostgreSQL.
- Kubernetes deployment profile after the Compose path is proven.

## Completion Standard

No work is complete until the applicable commands pass:

```bash
npm run check
```

For implementation work that affects a product template or generated product:

```bash
npm run compose:validate
npm run bundle:offline
npm run bundle:verify
```

