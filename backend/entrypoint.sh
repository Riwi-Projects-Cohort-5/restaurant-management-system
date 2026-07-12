#!/bin/bash

echo "Waiting for database to be ready..."
for i in $(seq 1 30); do
  python3 -c "import psycopg2, os; psycopg2.connect(os.environ['DATABASE_URL']).close()" 2>/dev/null && break
  echo "Attempt $i - database not ready, retrying in 2s..."
  sleep 2
done
echo "Database is ready."

echo "Running Alembic migrations..."
alembic upgrade head

echo "Starting uvicorn..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
