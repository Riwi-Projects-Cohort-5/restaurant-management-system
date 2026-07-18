#!/bin/bash
set -e

echo "=== Building frontend ==="
cd frontend
corepack enable
pnpm install --frozen-lockfile
pnpm build
cd ..

echo ""
echo "=== Building backend Docker image ==="
docker-compose build backend

echo ""
echo "Build complete."
