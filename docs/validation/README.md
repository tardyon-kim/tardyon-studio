# Validation Rounds

## Purpose

Validation rounds record how the harness is checked, where it failed, and what was changed before a round passed. This directory is evidence, not the source of permanent standards.

Permanent standards belong in:

- `HARNESS.md`
- `AGENTS.md`
- `docs/lifecycle/`
- `docs/rubrics/`
- `scripts/`
- `.github/workflows/`

## Current Model

Each round should:

1. Define a target and pass criteria.
2. Run independent validation where the risk justifies it.
3. Convert valid findings into docs, scripts, tests, or CI changes.
4. Re-run the relevant local and remote checks.
5. Record follow-up candidates without turning historical reports into permanent required files.

## Round Records

| Round | Record | Focus | Result |
|-------|--------|-------|--------|
| 1 | `2026-05-05-round-1-harness-coherence.md` | Toolchain role clarity, harness coherence, gstack remains optional | Passed |

## Durable Toolchain Position

Compound Engineering is the Core workflow, Superpowers is the Safety workflow, and gstack remains optional in v1 unless a later ADR makes it required for a specific high-risk review class.
