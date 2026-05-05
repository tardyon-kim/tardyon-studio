# Product Starter

This starter is the v1 reference product shape for the harness.

It is intentionally minimal:

- `apps/web` - Next.js + TypeScript frontend with shadcn/ui-compatible configuration and FSD directories.
- `apps/api` - NestJS + TypeScript backend.
- `compose` - Docker Compose runtime with PostgreSQL.
- `ops` - runbook and release notes skeleton.

## Start

```bash
npm install
docker compose -f compose/docker-compose.yml up --build
```

## Offline Rule

The running service must not require internet access.

