#!/usr/bin/env bash
set -euo pipefail

# Runs all text-align difference tests.
# Usage: test_text_align_all_diff.sh [base_branch] [solution_branch]

BASE_BRANCH=${1:-text-align-2d-text-base}
SOLUTION_BRANCH=${2:-text-align-2d-text-solution}

bash packages/proximal-testing-videos/src/testing_scripts/test_text_align_center_diff.sh \
  "$BASE_BRANCH" "$SOLUTION_BRANCH"

bash packages/proximal-testing-videos/src/testing_scripts/test_text_align_right_diff.sh \
  "$BASE_BRANCH" "$SOLUTION_BRANCH"

bash packages/proximal-testing-videos/src/testing_scripts/test_text_align_center_wrapped_diff.sh \
  "$BASE_BRANCH" "$SOLUTION_BRANCH"

echo "PASS: All text-align difference tests passed."

