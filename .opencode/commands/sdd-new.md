---
description: Start an SDD spec on the current feature branch
agent: orchestrator
---

Use the request below as the objective. Clarify only intent gaps that prevent delimiting exploration; then call the sdd tool:
{"action":"create","input":{"id":"lowercase-spec-id","title":"User objective"}}.
Derive id/title from the request if needed. Do not inspect Git, PRs, reports,
memories, installation or plugin source first. Do not switch branches or overwrite an
existing spec implicitly. The controller requires a feature branch and no active spec.
On success, follow next.agent=explorer immediately; on failure report the reason.
A rejected parameter is recoverable, not a corrupted spec or a failed acceptance.
This command authorizes
creation only; it does not approve the plan or final implementation.

$ARGUMENTS
