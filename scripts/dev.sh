#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== Starting database ==="
cd "$ROOT_DIR"
docker-compose up -d database

echo ""
echo "=== Waiting for database to be ready ==="
for i in $(seq 1 30); do
  docker-compose exec -T database pg_isready -U postgres > /dev/null 2>&1 && break
  sleep 1
done

echo ""
echo "=== Starting backend ==="
cd "$ROOT_DIR/backend"
pip install -r requirements.txt -q
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

echo ""
echo "=== Starting frontend ==="
cd "$ROOT_DIR/frontend"
corepack enable
pnpm install --frozen-lockfile
pnpm dev &
FRONTEND_PID=$!

echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo "Press Ctrl+C to stop."

trap "kill $BACKEND_PID $FRONTEND_PID; cd $ROOT_DIR && docker-compose down" EXIT
wait
