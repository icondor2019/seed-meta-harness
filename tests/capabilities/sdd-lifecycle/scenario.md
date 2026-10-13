# SDD lifecycle: simplified acceptance scenario

## Purpose and setup

Validate clarified intent, contextual invocations, human gates, selective Engram
persistence and mechanical archival without Git operations. No automatic commits,
Plane modifications or real persistence as part of implementing this scenario.
Prior attempts/reports and archived specs remain historical evidence, not overwritten.

Use the existing feature branch. On an actual user-requested run, create a unique
spec ID; if another spec is open resume or report the blocker without overwriting.
For the next fresh run use mhsdd-4-acceptance-3, with a separate run report named
runs/<date>-mhsdd-4-acceptance-3.md. The test evaluator owns that external report;
Archivist has no report sections or documentation preparation responsibilities.

The exercise modifies tests/fixtures/sdd-demo/ with dependency-free stateLabel and
node:test. Preserve existing work. Request initial Archivado and later reject it in
favor of Cerrado; if already present, plan a real bounded change instead of pretending
a no-op is implementation. Existing controller tests remain in tests/sdd/.

## Steps

1. Give Orchestrator an initially vague request such as changing authentication;
   verify it asks only material intent questions and uses supplied requirement
   references before asking again. Then supply the bounded fixture exercise.
2. With intent sufficient, create directly with id/title. No PR/staging/memory or
   infrastructure preflight. Success delegates Explorer immediately; failures have
   concrete reasons. Bad parameters without effects are recoverable.
3. Each invocation has why called, where work stands and what to do. Explorer receives
   broad synthesized intent/constraints/decisions, not merely "read scenario.md".
   Planner and subsequent specialists consume their deterministic artifacts. Prompt
   content must survive unchanged, including context longer than 300 characters.
4. Explorer persists intent/evidence; Planner writes proposal/tasks and design.md
   with "No aplica: este cambio no incluye UI/frontend". Confirm existence gate still
   blocks absent design. No frontend design or validation work is required.
5. Attempt Builder before plan approval: blocked. Present plan summary and stop for
   user text. Accept plan, implement and independently review. Run fixture tests and
   node --experimental-strip-types --test tests/sdd/*.test.mjs; record actual results.
6. Reviewer pass leads to implementation approval, not Archivist. Reject once, request
   the label correction, verify renewed implementation/review and textual acceptance.
7. Archivist first pass presents candidates with stable IDs and exact content in
   memory.md. Select a strict subset (e.g. A2/A4), or none with rationale. Persist that
   exact selection in the controller's approval receipt; no blanket acceptance.
8. Archivist second pass reads only memory.md proposal/receipts, saves the selected
   content unchanged and records each returned ID immediately. No re-analysis,
   report, scenario reading, external documentation, commit or SHA linkage.
9. Verify selected observations by their real IDs. Test retry using an actual partial
   failure when feasible: successful receipts are reused and only pending candidates
   are saved. If save succeeded but receipt failed, reconcile before any retry.
10. Archivist returns IDs and stops. Orchestrator calls archive; verify complete move,
    archived state and no overwrite. Git worktree/index remain unmodified by controller
    operations except local spec files (which are Git-ignored).
11. Evaluator records evidence and limitations outside Archivist. If testing real
    interruption, the user presses Escape during a task and later asks to continue.
    Completed-task reinvocation does not count as interruption evidence.

## Acceptance

Observe real agents and textual human decisions, no workflow judgments from old
artifact status logs, no routine reports and no Git-dependent closure. Partial
approval must exclude other candidates. Missing approvals, actual errors or incomplete
receipts block closure. Empty proposals/selections cause no Engram writes. /sdd-status
is one native line with no model turn. A partial/blocked run is not full acceptance.
Never fabricate observations, edit metadata to bypass gates, or overwrite prior
attempts. Keep every Markdown under 400 lines. Archived specs and past receipts may
retain old historical metadata; new entries must follow this contract.
