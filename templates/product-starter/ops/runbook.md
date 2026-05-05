# Product Runbook

## Start

```bash
docker compose -f compose/docker-compose.yml up -d
```

## Healthcheck

- API: `http://localhost:3001/health`
- Web: `http://localhost:3000`

## Backup

Use `pg_dump` from the PostgreSQL container and store the dump in the approved offline backup location.

## Restore

Restore with `psql` into a clean database after validating the target version.

## Upgrade

1. Stop application services.
2. Back up PostgreSQL.
3. Import new images.
4. Run migrations.
5. Start services.
6. Verify healthchecks.

## Rollback

1. Stop services.
2. Restore previous image set.
3. Restore database if migration rollback is not safe.
4. Start services.
5. Verify healthchecks.

