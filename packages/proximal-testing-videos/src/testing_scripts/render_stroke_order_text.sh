#!/usr/bin/env bash
set -euo pipefail

# Renders the stroke-order text scene to the given output file.
# Usage: ./render_stroke_order_text.sh <out_file>

OUT_FILE=${1:-stroke_order_text.mp4}

ROOT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../.." && pwd)
PKG_DIR="$ROOT_DIR/packages/proximal-testing-videos"

pushd "$ROOT_DIR" >/dev/null
npm run render -w packages/proximal-testing-videos --silent
node "$PKG_DIR/dist/render.js" "$PKG_DIR/src/stroke_order_text.tsx" "$OUT_FILE"
popd >/dev/null

echo "Rendered $OUT_FILE"

