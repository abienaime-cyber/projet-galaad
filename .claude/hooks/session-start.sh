#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

pnpm install

if ! python3 -c "import graphify, tree_sitter_sql" 2>/dev/null; then
  pip install --quiet "graphifyy[sql]==0.9.94"
fi

if ! claude plugin list 2>/dev/null | grep -q "code-simplifier@"; then
  claude plugin install code-simplifier --scope project
fi
