#!/bin/bash
set -e

echo "=== Deploying backend to Render ==="
if [ -z "$RENDER_API_KEY" ] || [ -z "$RENDER_SERVICE_ID" ]; then
  echo "Error: RENDER_API_KEY and RENDER_SERVICE_ID must be set."
  exit 1
fi

curl -s -X POST "https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys" \
  -H "Authorization: Bearer ${RENDER_API_KEY}" \
  -H "Content-Type: application/json"

echo ""
echo "Deploy triggered. Check: https://dashboard.render.com"
echo ""
echo "Frontend: Vercel auto-deploys on push to main."
