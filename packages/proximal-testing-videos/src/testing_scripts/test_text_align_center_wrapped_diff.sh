#!/usr/bin/env bash
set -euo pipefail

# Renders the center-aligned wrapped text scene on two branches and asserts they differ.
# Usage: test_text_align_center_wrapped_diff.sh [base_branch] [solution_branch]

BASE_BRANCH=${1:-text-align-2d-text-base}
SOLUTION_BRANCH=${2:-text-align-2d-text-solution}

SCENE=packages/proximal-testing-videos/src/text_align_center_wrapped.tsx
OUTDIR=.revideo-tests/text-align-center-wrapped
mkdir -p "$OUTDIR"

echo "Checking out $BASE_BRANCH and rendering base video..."
git checkout -q "$BASE_BRANCH"
npm run render -w packages/proximal-testing-videos -- "$SCENE" "$OUTDIR/base.mp4"

echo "Checking out $SOLUTION_BRANCH and rendering solution video..."
git checkout -q "$SOLUTION_BRANCH"
npm run render -w packages/proximal-testing-videos -- "$SCENE" "$OUTDIR/solution.mp4"

echo "Comparing outputs (expect difference)..."
bash packages/proximal-testing-videos/src/testing_scripts/compare_videos_ssim.sh diff \
  "$OUTDIR/base.mp4" "$OUTDIR/solution.mp4"

echo "PASS: Videos differ as expected (center alignment with wrapping)."

