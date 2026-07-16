#!/bin/bash

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$(dirname "$0")/../database/backups"

mkdir -p "$BACKUP_DIR"

echo "Creando backup de restaurant_db..."
docker-compose exec -T database pg_dump -U postgres restaurant_db > "${BACKUP_DIR}/backup_${TIMESTAMP}.sql"

echo "Backup guardado: database/backups/backup_${TIMESTAMP}.sql"
