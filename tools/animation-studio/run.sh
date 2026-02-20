#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if ! command -v node >/dev/null 2>&1; then
  echo "Error: node is not installed or not in PATH." >&2
  exit 1
fi

# Optional: pass port as first argument, e.g. ./run.sh 4300
if [[ "${1-}" != "" ]]; then
  export ANIM_STUDIO_PORT="$1"
fi

exec node server.js
