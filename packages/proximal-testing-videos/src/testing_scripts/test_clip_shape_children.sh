#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <gold_branch> <test_branch>" >&2
  exit 2
fi

GOLD_BRANCH="$1"
TEST_BRANCH="$2"

bash packages/proximal-testing-videos/src/testing_scripts/compare_across_branches.sh \
  packages/proximal-testing-videos/src/clip_shape_children.tsx \
  "$GOLD_BRANCH" "$TEST_BRANCH"

