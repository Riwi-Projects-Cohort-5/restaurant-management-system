#!/bin/bash
set -e

echo "=== Running backup ==="
bash "$(dirname "$0")/backup.sh"

echo ""
echo "=== Stopping containers ==="
docker-compose down

echo "Done."
