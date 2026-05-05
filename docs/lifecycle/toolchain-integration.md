# Toolchain Integration

## Purpose

This harness uses tools by role, not by brand. Compound Engineering, Superpowers, and gstack are integrated only where they strengthen the enterprise lifecycle loop without turning the harness into a product-domain template.

## Role Model

| Tool | Harness Role | Integration Level | Default Use |
|------|--------------|-------------------|-------------|
| Compound Engineering | Core lifecycle workflow | Required when available | Strategy, brainstorming, planning, implementation workflow, review, learning capture |
| Superpowers | Safety workflow | Required when available | TDD, systematic debugging, plan discipline, verification before completion |
| gstack | Optional Specialist workflow | Optional | Specialist QA, design review, security review, browser checks, release assistance, second-opinion review |
| GitHub Actions | CI gate | Required | Pull request and main branch validation |

## Lifecycle Mapping

| Stage | Core Workflow | Safety Workflow | Optional Specialist |
|-------|---------------|-----------------|---------------------|
| Discovery | Compound Engineering strategy or brainstorm | Superpowers brainstorming when behavior or scope changes | gstack second opinion for unclear enterprise risk |
| Strategy | Compound Engineering strategy | Superpowers planning discipline | gstack harness adoption or architecture critique when useful |
| Requirements | Compound Engineering brainstorm or plan | Superpowers writing-plans after approved requirements | gstack independent review for high-impact scope |
| Architecture | Compound Engineering plan and doc review | Superpowers verification of assumptions before implementation | gstack security, QA, or architecture review |
| Plan Validation | Compound Engineering plan review | Superpowers plan discipline and TDD posture | gstack second opinion only when risk justifies it |
| Implementation | Compound Engineering work flow | Superpowers test-driven-development and systematic-debugging | gstack targeted QA or browser validation |
| Implementation Validation | Compound Engineering code review | Superpowers verification-before-completion | gstack release, browser, security, or design checks |
| Release | Compound Engineering release notes and learning capture | Superpowers completion verification | gstack release assistance when needed |
| Operations | Compound Engineering pulse, debug, and learnings | Superpowers systematic debugging for incidents | gstack incident review or specialist diagnostics |
| Maintenance | Compound Engineering compound and refresh | Superpowers regression and verification discipline | gstack periodic external review |

## Operating Rules

1. Compound Engineering owns the lifecycle spine.
2. Superpowers owns the safety rails around planning, TDD, debugging, and completion claims.
3. gstack is not a required v1 dependency. It is pulled in only for specialist review or external critique.
4. GitHub Actions is the repository-level enforcement point.
5. Tool outputs do not override the harness standards. Exceptions require an ADR.
6. Product-domain behavior stays out of the harness unless it becomes a reusable infrastructure or operational constraint.
7. Plan validation and implementation validation stay separate.
8. Offline/on-prem runtime constraints are checked before release, not after deployment.

## gstack Boundary

gstack remains optional in v1 because the harness must work without adding another mandatory runtime or workflow dependency. It can be integrated later as a named specialist layer if Round 2 or later validation proves that it provides repeatable value beyond Compound Engineering, Superpowers, and the repository scripts.

Acceptable gstack uses:

- Independent security review of a high-impact change.
- Browser or UX quality review for user-facing surfaces.
- Release readiness review before packaging offline artifacts.
- Second-opinion architecture critique for risky exceptions.

Unacceptable gstack uses:

- Replacing the plan gate or implementation gate.
- Making product-domain decisions inside the harness.
- Introducing mandatory cloud or online runtime dependencies.
- Bypassing TDD, debugging, verification, or CI requirements.

## Minimum Integration Standard

The toolchain is considered integrated only when:

- `AGENTS.md` assigns each tool a clear role.
- This document maps each tool to lifecycle stages.
- `docs/rubrics/harness-coherence.md` defines coherence checks.
- `npm run check:toolchain` validates the required documentation and role boundaries.
- `npm run check` runs the toolchain check in CI and locally.
