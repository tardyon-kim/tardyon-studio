# Harness Coherence Rubric

## Purpose

Harness Coherence checks whether the repository still behaves like an enterprise lifecycle harness instead of drifting into a product template, a loose documentation folder, or a tool collection.

## Pass Criteria

| Dimension | Pass Standard | Fails When |
|-----------|---------------|------------|
| Purpose Boundary | The harness standardizes lifecycle, infrastructure, scripts, and operations. | It hard-codes product-domain screens, workflows, or data models. |
| Toolchain Roles | Compound Engineering is Core, Superpowers is Safety, and gstack is Optional Specialist. | Tool roles overlap without a clear owner or a tool becomes mandatory without a gate decision. |
| Validation Split | plan validation and implementation validation are separate. | A document-only plan is treated as implementation proof, or passing tests are treated as plan approval. |
| Executable Gates | CI and npm scripts enforce required checks. | Quality claims depend only on prose or manual memory. |
| Offline Runtime | offline/on-prem assumptions are explicit before release. | Runtime service behavior requires an internet dependency by default. |
| Template Alignment | The root reference monorepo and product starter stay aligned. | The starter diverges from the reference path without an ADR. |
| Exception Handling | FastAPI, InfluxDB, Kubernetes, or other exceptions are captured in ADRs. | Exceptions appear silently in code, docs, or compose files. |
| Agent Operability | An agent can infer the next step from `AGENTS.md`, lifecycle docs, scripts, and rubrics. | The agent must ask product-level questions to perform harness-level work. |

## Round Review Checklist

Use this checklist at the end of every validation and review round:

1. The round has an explicit target and pass criteria.
2. New standards are backed by scripts or tests where practical.
3. Any product-domain assumptions are removed or marked as examples.
4. Any new mandatory tool dependency is justified and documented.
5. Plan validation changes are reflected in `scripts/check-plan.mjs` or its inputs.
6. Implementation validation changes are reflected in `scripts/check-implementation.mjs`, tests, or CI.
7. Offline bundle generation and verification still run.
8. Remaining gaps are recorded as follow-up candidates.

## Severity Guide

| Severity | Meaning | Required Action |
|----------|---------|-----------------|
| Blocker | Breaks the harness identity, CI gate, or offline/on-prem promise. | Fix before the round can pass. |
| High | Weakens repeatability, review discipline, or release confidence. | Fix in the current round unless explicitly deferred. |
| Medium | Creates ambiguity for agents or humans. | Fix or record as a Round 2 candidate. |
| Low | Improves clarity but does not affect execution. | Batch with nearby documentation work. |

## Round 1 Focus

Round 1 passes when the repository clearly answers:

- Which lifecycle role is owned by Compound Engineering, Superpowers, and gstack.
- Which tool is Core, Safety, or Optional Specialist.
- Why gstack is optional in v1.
- How the toolchain remains subordinate to the harness purpose.
- How `npm run check` detects the toolchain integration baseline.
