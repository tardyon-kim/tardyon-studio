# Operations Stage

## Purpose

Run the deployed service reliably without internet access.

## Inputs

- Offline bundle.
- Docker Compose deployment.
- Runbook.
- Environment configuration.

## Outputs

- Running service.
- Logs.
- Healthcheck status.
- Backup and restore records.

## Gate

The service must be observable, restartable, backupable, and restorable without external services.

