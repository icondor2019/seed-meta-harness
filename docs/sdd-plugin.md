# SDD controller: operation and recovery

Reference only; role system prompts are self-contained. The server plugin is
.opencode/plugins/sdd.ts; tui.json loads .opencode/tui/sdd-status.ts. Installed
plugin API is 1.15.3. /sdd-status shows one persisted-state line without a model turn.

## Interface and authority

sdd takes action and typed optional input; runtime provides role identity. Mutations
use an exclusive lock. Version-3 state.json owns states, approvals and receipts.
Markdown semantics, checkboxes and historical logs never establish state. Gates check
artifact existence and the 400-line Markdown limit; agents evaluate quality.

Once intent is sufficient: create {id:"my-spec",title:"User objective"} returns
next {action:"delegate",agent:"explorer",spec:"my-spec"}. No clean-tree or PR prerequisite.
Orchestrator clarifies material user-intent gaps before this; technical unknowns belong
to Explorer. No infrastructure, memory or report preflight.

The task hook validates dispatch and preserves task.prompt exactly. Orchestrator
supplies why called, where work stands, and what to do. No header validator, truncation,
automatic previous-report concatenation or raw-document assignment. description is
only a label. handoff {agent,note} returns note unchanged after the same authorization.
Specialists know their artifact conventions under specs/open/<spec>/.

## Operations

| State | Responsible | Action / input |
| --- | --- | --- |
| exploring | Explorer then Orchestrator | transition {to:"planning"} |
| planning | Planner then Orchestrator | transition {to:"plan_pending_approval"} |
| plan_pending_approval | Orchestrator/user | request_approval; approve {decision} |
| implementing | Builder then Orchestrator | transition {to:"ready_for_review",files:[paths]} |
| ready_for_review | Orchestrator | transition {to:"reviewing"} |
| reviewing | Reviewer | review {verdict:"pass" or "changes-required"} |
| changes_pending_approval | Orchestrator/user | request_approval; approve {decision} |
| preparing_closure | Archivist first pass | prepare_closure {candidates,okfUpdates,reason?,okfReason?} |
| knowledge_pending_approval | Orchestrator/user | request_approval; approve {decision,selected,selectedOkf,reason?,okfReason?} |
| persisting_knowledge | Knowledge Curator | okf {okfReceipts:[{update,files,evidence}]} |
| persisting_memory | Archivist second pass | memory {receipts:[{candidate,observation}]} |
| archiving | Orchestrator | archive |

status reads only metadata. validate checks existence/line limits. correct returns to
implementation; replan returns to planning; both invalidate affected gates before
memory persistence. migrate upgrades an active legacy spec with a verbatim backup.
report is optional only for concerns needing bounded excerpts/answers: result, summary,
concerns [{id,question,artifact,start,end}], at most five, at most 30 excerpt lines.
concern {owner,id} retrieves the explicit excerpt; answer {owner,id,answer} returns a
brief user response for the owner to persist. No routine report or completion gate.

## Human decisions and memory

After request_approval, stop for ordinary user text. The SDK resolves the actual
parent user message; synthetic text, child conversations, old messages and reused
receipts are rejected. Orchestrator interprets intent; the plugin does not parse
natural language. A receipt proves message identity, not semantic interpretation.

Reviewer pass leads to human implementation acceptance before Archivist starts.
Archivist curates exact Engram candidates in memory.md and OKF proposals in
okf-update.md. prepare_closure registers both lists: candidates:[{id,content}] and
okfUpdates:[{id,content,files}], with exact exclusive knowledge/ Markdown destinations.
Empty lists require reason and okfReason respectively. Only when both lists are empty
does closure proceed without another approval or writes. Otherwise user approval
records explicit selected and selectedOkf subsets, including empty lists and reasons.
Unselected content is never authorized.

Selected OKF updates enter persisting_knowledge first. Knowledge Curator writes pending
approved paths and records okfReceipts:[{update,files,evidence}] incrementally. Receipt
paths must match the proposal and exist; content quality is assessed by the agent/user,
not parsed by the controller. Failed or incomplete updates block archival. After OKF
completes or has a justified no-write outcome, any selected Engram work proceeds.

Second pass reads only memory.md proposal/receipts. Save approved content unchanged,
then record each returned Engram ID immediately via memory. Partial receipts survive
restarts; completed candidates cannot be saved again through the hook. Native save
checks exact content against the selected candidates. Updates/deletes are not part
of this persistence operation. No references to commits, SHA or Git in Engram content.
No external documentation or report consolidation belongs to Archivist.

If Engram succeeds but its receipt cannot be saved, stop and reconcile the known ID
before retrying. The controller is not a distributed transaction with Engram and
cannot promise exactly-once delivery across that crash window. Never blindly resave.
Once both persistence outcomes are recorded, Orchestrator archives mechanically,
rechecking the existence of receipted OKF files. okf-update.md remains in the spec until
the entire spec is archived; it is never removed before Knowledge Curator reads it. No Git
operations or commit prerequisite are exposed; Git is a separate user-requested task.

## Recovery and limits

Migration supports active versions 1/2. Save state.v<version>.backup.json verbatim,
retain historical approvals and previous memory receipts; discard obsolete Git/hash
gates. Completed legacy persistence is never queued again. Without an unambiguous
candidate selection, return to proposal/selection instead of guessing approval.
No archived spec is rewritten and no migration runs automatically at startup.

An older version-3 archiving/persisting_memory state without OKF assessment cannot
complete closure. migrate reopens preparing_closure while preserving memory receipts.
Archivist assesses OKF and does not requeue already persisted Engram content. Legacy
versions 1/2 are first upgraded normally, then use this recovery when applicable.

Permission failures, corrupt metadata and failed writes do not advance state. A stale
.sdd.lock requires checking whether its operation is live before removing it. The
state.json file is authoritative over interrupted .tmp files. Archive rejects
collisions, retries busy-file moves and rolls back a failed metadata finalization.

This controls plugin operations, not arbitrary filesystem access. Agents must report
external changes; there are no content hashes or OS isolation guarantees. Codex
adaptation, remote Engram sync and OKF methodology documentation remain separate work.

## Checks

Run node --experimental-strip-types --test tests/sdd/*.test.mjs. Tests use disposable
local repositories and mocked persistence, no real Engram calls. See sdd-validation.md
and the capability scenario for separate interactive acceptance. Tool discovery alone
does not establish model-backed acceptance.
