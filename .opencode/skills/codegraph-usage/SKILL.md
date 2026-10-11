---
name: codegraph-usage
description: Explore indexed repository structure, symbols and dependencies with CodeGraph, and refresh its index manually when needed.
---

# CodeGraph usage

Adapted from `.opencode_test/skills/codegraph-usage/SKILL.md` for selective adoption.

For structural investigation, use CodeGraph when available and indexed. Query a
concrete symbol, file or source-to-destination flow; prefer returned relationships
over repeated broad file scans. If no matches, retry once with more precise terms,
then use repository-native search. Distinguish no matches from unavailable/error.
For an unindexed repository use native tools; do not silently install or initialize.

After relevant edits, refresh explicitly with `codegraph sync --quiet` from the
repository root when graph freshness is needed. Check the exit code: quiet mode
can fail without a diagnostic. Treat stale results as incomplete evidence.
First bootstrap is separately documented in `docs/tools/windows.md`.

Never add watchers, git hooks, scheduled sync or automatic update integrations.
Keep `CODEGRAPH_NO_DAEMON=1`, `CODEGRAPH_NO_WATCH=1` and `--no-watch` on this MCP.
Version 1.6.2 still performs catch-up at connection; disclose this exception rather
than claiming fully manual operation. Do not patch installed packages implicitly.

Respect assigned role permissions. Tool availability does not authorize edits,
delegation or persistence. Do not invoke CodeGraph for unrelated requests.
