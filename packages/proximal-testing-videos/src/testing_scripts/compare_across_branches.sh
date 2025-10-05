#!/usr/bin/env bash
set -euo pipefail

# Renders the same project file on two branches and compares outputs.
# Usage: compare_across_branches.sh <project_rel_path> <gold_branch> <test_branch>

if [[ $# -lt 3 ]]; then
  echo "Usage: $0 <project_rel_path> <gold_branch> <test_branch>" >&2
  exit 2
fi

PROJECT="$1"
GOLD_BRANCH="$2"
TEST_BRANCH="$3"

ROOT_DIR=$(git rev-parse --show-toplevel)
OUT_DIR="$ROOT_DIR/.tmp-clip-tests"
mkdir -p "$OUT_DIR"

build_all() {
  npm run core:build
  npm run 2d:build
  npm run renderer:build
}

render() {
  local project_file="$1"
  local out_file="$2"
  node packages/proximal-testing-videos/src/render.js "$project_file" "$out_file"
}

git checkout "$GOLD_BRANCH"
build_all
render "$PROJECT" "$OUT_DIR/gold.mp4"

git checkout "$TEST_BRANCH"
build_all
render "$PROJECT" "$OUT_DIR/test.mp4"

bash packages/proximal-testing-videos/src/testing_scripts/compare_videos_ssim.sh \
  "$OUT_DIR/gold.mp4" "$OUT_DIR/test.mp4" 1.0

echo "Videos match for $PROJECT across $GOLD_BRANCH vs $TEST_BRANCH"

