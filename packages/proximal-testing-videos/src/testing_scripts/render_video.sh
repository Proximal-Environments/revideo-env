#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 2 ]; then
  echo "Usage: $0 <project_tsx_path> <out_file.mp4>" >&2
  exit 2
fi

PROJECT_FILE="$1"
OUT_FILE="$2"

echo "[build] Building core, 2d, renderer..."
npm run core:build >/dev/null 2>&1
npm run 2d:build >/dev/null 2>&1
npm run renderer:build >/dev/null 2>&1

echo "[render] ${PROJECT_FILE} -> ${OUT_FILE}"
node packages/proximal-testing-videos/src/render.mjs "$PROJECT_FILE" "$OUT_FILE"

