#!/bin/bash
set -e

echo "=== Running backend lint + tests ==="
cd backend
pip install ruff pytest httpx -q
ruff check app/ tests/
python -m pytest tests/ -v --tb=short
cd ..

echo ""
echo "=== Running frontend lint + format check + build ==="
cd frontend
corepack enable
pnpm install
pnpm lint
pnpm format:check
pnpm build
cd ..

echo ""
echo "All checks passed."
