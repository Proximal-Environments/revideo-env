#!/usr/bin/env bash
set -euo pipefail

# Render a given project TS/TSX file to an output video using the local renderer entry.
# Usage: render_video.sh <project.tsx> <out.mp4>

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <project.tsx> <out.mp4>" >&2
  exit 2
fi

PROJECT="$1"
OUTFILE="$2"

ROOT_DIR="$(cd "$(dirname "$0")/../../.." && pwd)"
PKG_DIR="$ROOT_DIR/packages/proximal-testing-videos"

cd "$PKG_DIR"

# Build TS -> dist
npm run -w @revideo/testing render --silent --prefix false >/dev/null 2>&1 || true
./node_modules/.bin/tsc >/dev/null 2>&1 || true

node dist/render.js "$PROJECT" "$OUTFILE"

