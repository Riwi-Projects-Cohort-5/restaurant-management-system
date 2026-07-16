#!/bin/bash

echo "=== Backup antes de apagar ==="
bash "$(dirname "$0")/backup.sh"

echo ""
echo "=== Apagando contenedores ==="
docker-compose down

echo "Listo."
