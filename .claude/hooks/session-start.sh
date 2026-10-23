#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

pnpm install

if ! command -v graphify >/dev/null; then
  pip install --quiet graphifyy==0.9.94
fi

if ! claude plugin list 2>/dev/null | grep -q "code-simplifier@"; then
  claude plugin install code-simplifier --scope project
fi
