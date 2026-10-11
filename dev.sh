#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

(until curl -s http://localhost:3000 > /dev/null 2>&1; do sleep 1; done && open -a "Google Chrome" http://localhost:3000) &

docker compose up --build
