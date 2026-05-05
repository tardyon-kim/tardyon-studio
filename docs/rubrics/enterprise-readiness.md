# Enterprise Readiness Rubric

## Required

- Runs without internet access in the service environment.
- Has a Docker Compose deployment path.
- Has healthchecks.
- Has structured logs.
- Has backup and restore procedures.
- Has upgrade and rollback procedures.
- Has audit-relevant events where required.
- Has documented secrets and configuration handling.

## Review Questions

- Can an operator install it from offline artifacts?
- Can an operator diagnose a failed start?
- Can data be restored after failure?
- Can a patch be applied safely?

