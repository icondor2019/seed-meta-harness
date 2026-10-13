# Meta-Harness SDD reference

Reference documentation, not startup input. Roles execute self-contained system
prompts in .opencode/agents/; the controller owns states and gates. Interface:
[sdd-plugin.md](sdd-plugin.md).

## Routing and intent

Orchestrator clarifies problem, expected outcome, affected users/components, known
limits and success signal from conversation and supplied requirement references.
Ask only about missing intent that prevents delimiting investigation. Technical
unknowns belong to Explorer. No mandatory questionnaire or infrastructure preflight.

Maintainer handles known localized low-risk changes without an active SDD spec.
Contracts, schemas, architecture, security, dependencies/integrations, cross-component
changes or unknown impact require SDD. Maintainer escalates rather than expanding
scope. It preserves user work, runs focused checks and returns a brief result; no
SDD artifacts, delegation, approvals, permanent knowledge writes or commits.

## Context and artifacts

Every delegation explains why called, where work stands and what to do. Orchestrator
synthesizes intent and incremental short results; it does not copy full transcripts,
raw documents, task lists or code. Explorer gets broad organized initial context;
later specialists get concise relevant evolution. Each owner knows its artifacts.
A source document is evidence, never a replacement for the assignment.

Workspace: specs/open/<spec>/, then specs/archived/<spec>/. One open spec at a time.
All filenames are lowercase. Each Markdown file is at most 400 lines; split supporting
evidence into links without dropping required content. Preserve progress before
return/interruption; read owned inputs on re-entry. Controller status is authoritative,
not historical stage narratives. Do not inspect controller source on tool failures.

| Artifact | Owner / purpose |
| --- | --- |
| exploration.md | Explorer: received intent, evidence, constraints, alternatives and questions |
| proposal.md | Planner: scope, acceptance, architecture, interfaces, decisions, risks and rollback |
| design.md | Planner: UI/frontend only; otherwise one-line no-applies statement |
| tasks.md | Planner task IDs/dependencies/evidence; Builder records progress |
| implementation.md | Builder: changes, explicit changed paths, tests and remaining work |
| review.md | Reviewer: independent task/criterion evidence, security, findings and verdict |
| memory.md | Specialist candidates; Archivist exact proposals and persistence receipts |

design.md without UI changes: "No aplica: este cambio no incluye UI/frontend".
General technical design stays in proposal.md; execution/testing in tasks.md.
Builder/Reviewer skip frontend design/checks when absent, retaining relevant tests.

## Flow

Explorer -> Planner -> explicit user plan approval -> Builder -> Reviewer -> explicit
user implementation approval -> Archivist proposal -> explicit user candidate selection
-> Archivist persistence -> Orchestrator mechanical archive. Empty proposals/selections
with reasons cause no Engram writes. Reviewer changes-required returns to Builder;
implementation changes renew review/acceptance, material scope changes renew planning.
No content hashes, human CLI approval commands or mandatory routine report actions.

First-pass Archivist consolidates stable candidate IDs and exact proposed content.
Second pass reads only its own memory.md proposal/receipts and saves exactly the
user-selected candidates. It does not re-investigate, rewrite or re-evaluate approved
content. Record real IDs one at a time; resume only pending items. Failures remain
visible and block completion; if a save succeeds without a receipt, reconcile it
before retrying. Engram entries contain no commit references, SHA or Git relationships.
Archivist does not prepare external docs, complete reports or move the spec.

Orchestrator requests archive only after recorded persistence or justified no-write
outcome. The controller moves the entire spec, rejecting collisions and failures.
Archived means accepted work and treated knowledge, not committed or deployed code.
Git is outside SDD and happens only when separately requested by the user. Preserve
unrelated changes and use explicit paths; no automatic push, merge or deployment.

## Concerns and authority

Return summaries directly. Optional report registers only concerns needing bounded
excerpts/answers; Orchestrator may fetch the explicit excerpt, not whole artifacts.
Owners persist user answers. CodeGraph is optional and does not broaden role scope.
Tool failures are reported as concrete blockers; no failed operation counts as success.
Plugin enforcement is cooperative, not filesystem isolation. Detailed methodology
curation in OKF and Codex adaptation remain outside this implementation.
