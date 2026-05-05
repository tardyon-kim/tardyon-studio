# Tardyon Studio

Tardyon Studio is an enterprise software lifecycle harness.

It is not a product repository. It is the system used to discover, plan, build, verify, package, and operate products that must run in a fully offline/on-prem service environment while development happens in an internet-enabled environment.

## Harness Scope

- Source control: GitHub public repository, free plan, trunk-based development, Conventional Branches, Conventional Commits, PR-only workflow, Squash Merge.
- Deployment reference path: Docker Compose.
- Future deployment path: Kubernetes-compatible design decisions, without implementing Kubernetes in v1.
- Frontend reference path: Next.js, TypeScript, shadcn/ui-compatible structure, Feature-Sliced Design.
- Backend reference path: NestJS, TypeScript. Python/FastAPI is allowed by ADR exception.
- Database reference path: PostgreSQL. InfluxDB is allowed by ADR exception when time-series requirements justify it.
- Architecture posture: clean-pattern-oriented, without layer ceremony when complexity does not justify it.

## Repository Shape

This repository is a reference monorepo harness.

```text
apps/
  web/          # Next.js + TypeScript + shadcn/ui-compatible FSD reference app
  api/          # NestJS + TypeScript reference API
packages/
  shared/       # shared contracts and utility types
  config/       # shared config conventions
  db/           # PostgreSQL migration and operations conventions
ops/
  compose/      # Docker Compose reference deployment
  docker/       # Dockerfiles for reference services
  runbooks/     # operational runbooks
docs/
scripts/
templates/
```

`templates/product-starter` remains as the copyable starter, but the root monorepo is the source of truth that CI validates.

## Lifecycle Loop

```text
idea -> strategy -> requirements -> architecture -> plan -> plan gate
     -> implementation -> implementation gate -> release -> operations -> learnings
```

The harness separates planning quality from implementation quality:

- Plan gate: validates clarity, boundaries, decisions, risks, offline/on-prem concerns, and verification design before implementation starts.
- Implementation gate: validates actual files, scripts, CI, Docker Compose, offline bundle generation, and operational readiness.

## Quick Start

```bash
npm run check
```

Create a product workspace from the starter template:

```bash
npm run init:product -- my-product
```

Create an offline bundle of the harness artifacts:

```bash
npm run bundle:offline
npm run bundle:verify
```

## Key Documents

- `HARNESS.md` - how to use and evolve the harness.
- `AGENTS.md` - AI agent workflow and tool responsibilities.
- `STRATEGY.md` - strategy for the harness itself.
- `docs/lifecycle/` - lifecycle stage contracts.
- `docs/templates/` - reusable planning and operations templates.
- `docs/rubrics/` - quality gates and review rubrics.
- `docs/playbooks/` - operational playbooks for common work.
