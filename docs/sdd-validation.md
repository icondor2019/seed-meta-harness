# MHSDD-4 validation evidence

Branch: codex/mhsdd-4-plugin-determinista-workflow-sdd. Reference .opencode_test
is unchanged. Changes in this correction pass were not committed or persisted to memory
by Codex. The separately executed OpenCode run is identified below.

## Failed initial acceptance

The original 13 automated checks passed but did not establish an acceptable design.
The user reported Orchestrator artifact reading and copied delegation contents,
terminal approval commands, premature Archivist dispatch, invasive hash gates and
model-based status verbosity. The interactive attempt is failed, not accepted.
Its existing artifacts and evidence are preserved.

## Corrective automated validation — 2026-10-11

The earlier version-2 replacement suite passed 20/20 tests using:

```powershell
node --experimental-strip-types --test tests/sdd/*.test.mjs
```

Coverage includes actual temporary Git commits and archives, conversational-source
receipts, denied/stale approvals, correction and renewed review, preapproval Archivist
blocking, knowledge proposals, artifact edits without hashes, deterministic operation-based
handoffs, bounded concerns, minimal status, version-1 recovery, corrupt state,
permission errors, locks, archive collisions, line limits, unrelated staging,
deletion/rename, premature native persistence and interrupted commit retry. Native TUI status is tested with a
mock API that rejects SDK/model calls.

OpenCode debug config discovers sdd.ts without a model call; tui.json registers sdd-status.ts separately.
Only plugin paths and default agent were printed; configuration secrets were omitted.
OpenCode 1.19.0 was started in a PTY without a model request. Native /sdd-status
was selected and displayed exactly: mhsdd-4-acceptance: implementing (rev. 17).
Initial placement under server plugins failed; moving it to .opencode/tui/ and
registering it in tui.json resolved that real loading failure. The PTY was closed.
The unchanged fixture tests also passed 4/4.

The actual version-1 state was migrated through the controller to version 2,
implementing revision 18. state.v1.backup.json preserves the original metadata.
Artifacts, historical acceptance/rejection and user changes were preserved.
No new approval, project commit, memory write or archive was performed.

## Minimal-context correction and observed concurrent closure

All seven role contracts now embed their own duties and artifact conventions, with
no mandatory workflow-document loading. Invocation contains an authorized imperative,
spec name and bounded context, without role redefinition or artifact path lists.
Archivist operations are explicitly separated. Regression tests demonstrate that a
stale memory.md status cannot change its assignment; the controller remains authoritative.

During this pass, another OpenCode execution completed the existing spec. Reading
its archived controller metadata showed archived revision 31, local commit
f412f942057430fc104e0c601a7c796f85ccfc7e and memory receipt IDs 134 through 139.
These are observed metadata receipts, not an independent verification of their content
or a claim that the newly edited prompts were loaded by that execution.

Restart OpenCode to load these latest contracts and adapter. Validate them in a new
spec; do not reopen or overwrite the archived attempt. See
[scenario](../tests/capabilities/sdd-lifecycle/scenario.md). The latest prompt behavior
is automatically tested but still needs a fresh interactive run.

## Explicit startup correction

AGENTS.md now contains only shared execution rules and optional references; its
installation/bootstrap instructions were preserved in the Windows setup guide.
The tool schema exposes typed named fields instead of an arbitrary input record.
Create explicitly takes id/title and returns the next Explorer assignment; Orchestrator
and sdd-new require immediate creation without manual infrastructure/PR checks.

New tests verify parameter errors leave no spec, active-spec/main-branch blockers,
immediate Explorer assignment and preservation of unrelated staged/local changes.
Input schema tests reject guessed fields and incorrect types. OpenCode debug config
loads the seven agents and sdd-new. Markdown limit and git diff --check pass.
Observed current controller status is idle; this pass did not start another spec.

The acceptance scenario now assigns report ownership and its exact filename before
execution. Real interruption is performed by the user; re-entry after completed work
does not count as interruption evidence. Bad parameters without effects are recoverable.

## Simplified lifecycle v3 — 2026-10-11

The current suite passes 22/22 with the command above. Coverage includes both human
gates, exact partial candidate selection, zero candidates/empty selection, partial
receipts and retries without duplicate authorization, restart recovery, archive by
Orchestrator without commit/SHA, migration backups and historical receipt preservation,
full task.prompt preservation, minimal frontend-only design.md, missing artifacts,
invalid roles/operations, permissions, corrupt metadata, exclusive locks and archive
collision/rollback. Tests use disposable repositories; no project commit was created.

OpenCode debug config discovers the server plugin and all seven agents with
orchestrator as default. This verifies configuration discovery, not interactive
acceptance. Current controller status is idle. No active spec was migrated, no new
acceptance run was started, and neither Plane nor Engram was written in this pass.
Archived specs and historical evidence remain unchanged.

Repository-owned Markdown passes the 400-line limit and git diff --check passes.
Installed node_modules documentation is excluded from the repository document limit.
Node emits an informational module-type warning while importing the TypeScript adapter;
the tests still pass. Restart OpenCode and execute the updated scenario for interactive
acceptance of v3; earlier acceptance results do not validate this changed lifecycle.

A successful Engram save followed by a failed local receipt write is not an atomic
transaction. Archivist must return the known observation ID and reconcile it before
retrying; the controller does not claim distributed exactly-once persistence.

## Delivery decision — 2026-10-11

The user explicitly requested closure of MHSDD-4, inclusion of all pending repository
changes, and a task-linked commit and PR, without another interactive acceptance run.
The v3 scenario remains available for future regression runs. Interactive v3 acceptance
was waived for this delivery; it is not reported as executed or passed. Automated
validation remains 22/22 controller/adapter tests and 4/4 fixture tests. Historical
acceptance reports describe earlier versions and are preserved without rewriting.
Git publication is a separate user-authorized operation, outside the SDD controller.
