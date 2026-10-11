# Meta-Harness SDD contract

## Routes and authority

The entry request can describe a light change (small text, color or size adjustment
with no material architectural, security or consistency risk) or a heavy change
requiring investigation and explicit planning. Maintainer handles the light route
under the bounded contract below. Orchestrator must not use that route to bypass
the heavy route's approvals. File count alone does not classify risk.

All Markdown documentation, agent definitions, skills and execution artifacts have
a mandatory maximum of 400 lines per file. Preserve required entry filenames and
split larger content into linked supporting files inside the same documentation or
spec workspace. Never truncate evidence, questions or progress to meet the limit.
The future plugin must validate this limit; no automatic enforcement exists yet.

CodeGraph is optional and may be used by roles permitted to investigate when it is
available in the execution environment. Its absence is not a blocker: use native
search/read tools and record limitations. Availability does not broaden a role's scope.

## Light route — Maintainer

Orchestrator delegates a known, localized, low-risk change to Maintainer with an
explicit objective, allowed paths and focused validation. Maintainer checks scope
before editing. Public contracts, schemas, architecture, dependencies/integrations,
security boundaries, cross-component coordination or uncertain impact require
ESCALATE_TO_SDD, with any existing progress reported. Orchestrator then coordinates
Explorer and the heavy route; Maintainer does not perform that transition itself.

Maintainer makes the smallest authorized change, preserves unrelated work and runs
focused checks. It cannot modify SDD artifacts, approve work, delegate, commit, push
or deploy. It returns changed paths, check results, blockers and reusable knowledge
candidates with evidence; routine work may have no candidates. It does not persist
knowledge to Engram or OKF. A completion report does not imply human acceptance.
Persistent light-route receipts, interrupted-session recovery, knowledge handoff
and controller gates remain pending; do not invent heavy-route artifacts for them.

The heavy route below is the intended contract. Orchestrator coordinates assignments;
specialists produce content; the deterministic plugin authorizes transitions using
required file existence, recorded state and explicit human approvals. The plugin
does not assess meaning, security or correctness. A completed agent assignment is
not an authorized state transition.

The plugin, its API, state storage and approval recording mechanism are pending.
Do not invent commands, fabricate approval records or claim enforcement. This task
defines behavior and integration requirements; it does not implement those mechanisms.

## Workspace and artifacts

Use these exact, case-sensitive names, including Exploration.md:

```text
Specs/
  Open/<spec>/
    Exploration.md
    proposal.md
    design.md
    tasks.md
    implementation.md
    review.md
    memory.md
  Archived/<spec>/
```

One active spec per feature branch. All execution artifacts belong to the assigned
spec directory. Archived artifacts are local and excluded from Git. Do not create
empty artifacts as evidence of work or gate satisfaction.

| Artifact | Owner and content |
| --- | --- |
| Exploration.md | Explorer: evidence, constraints, affected areas, alternatives and unknowns |
| proposal.md | Planner: intent, scope, approach, acceptance criteria, risks, rollback and questions |
| design.md | Planner: architecture, contracts, data flow, decisions and validation strategy |
| tasks.md | Planner defines stable checklist IDs; Builder records execution progress |
| implementation.md | Builder: per-task changes, validation, remaining work and persistent questions |
| review.md | Reviewer: task-by-task evidence, findings, security assessment and verdict |
| memory.md | Agents append candidates; Archivist consolidates and records persistence outcomes |

## Persistence and handoff

Agents have independent contexts and configurable models. Pass the objective,
constraints, explicit artifact paths, task scope and allowed outputs, not the full
parent transcript. Keep one writer active at a time in the shared filesystem.

Before returning completed, blocked or failed, persist available progress, evidence
and questions in the owned artifact. If writing fails, report the persistence failure
explicitly; do not claim the handoff is recoverable. Return only a short summary,
artifact paths, blockers and question identifiers. Full investigation and reasoning
remain in artifacts. On re-entry, read those files before continuing; child-session
reuse is an optimization, never a requirement for recovery.

Questions use stable IDs, status (open/resolved), question text, answer and impact.
Orchestrator records the user's answers in the originating artifact before delegating
again, preserving prior questions. Evidence questions go to Explorer; requirements
and scope decisions go to the user. Record which artifact revision a decision concerns.

Each agent appends useful candidates to memory.md with its role, the finding, evidence
and artifact/task references. Entries are candidates, not facts approved for permanent
storage. Do not copy entire artifacts or secrets into memory. Only Archivist persists
selected knowledge into Engram or curated documentation.

## Heavy-route stages

| State | Work and condition for the next step |
| --- | --- |
| exploring | Explorer persists Exploration.md and reports findings |
| planning | Planner first persists proposal.md, including unresolved questions; then completes proposal, design and tasks |
| plan_pending_approval | Present the current planning artifacts; implementation waits for explicit human approval |
| implementing | Builder executes approved tasks, updates their checklist and implementation.md |
| ready_for_review | Builder reports the assigned work complete with evidence; no implied review verdict |
| reviewing | Reviewer writes review.md; findings return through Orchestrator to Builder, then require another review |
| preparing_closure | After a passing review, Archivist consolidates memory candidates and prepares required OKF updates |
| changes_pending_approval | User explicitly approves final implementation and OKF changes |
| committing | Coordinate a local commit of approved implementation and OKF, excluding spec artifacts; obtain its hash |
| archiving | Archivist persists selected Engram learnings with the hash, then requests deterministic archival |
| archived | Required persistence succeeded and the plugin moved the full spec directory to Archived |

These are state names for the future controller, not an implemented storage schema.
A blocker retains the current stage and unresolved assignment. No failed write,
validation, commit, knowledge persistence or archive operation counts as success.

Planner must persist a provisional proposal before returning questions, even if
design and tasks cannot yet be produced. All three planning artifacts must be ready
for plan approval; file existence alone is insufficient semantic evidence.

Material planning revisions invalidate previous plan approval. Implementation
corrections require renewed review; changes after final human approval require
renewed final approval. If closure preparation changes implementation or invalidates
review evidence, route back to review or planning as appropriate. Orchestrator
coordinates these requests only through transitions permitted by the controller.

## Commit, knowledge and archival

Archivist owns both knowledge preparation and persistence. Reviewer owns verification,
not permanent-memory maintenance. Prepare OKF before final approval and commit so
the user approves the documentation with the implementation. Do not try to embed
a commit's own hash into files inside that same commit.

Orchestrator coordinates the commit; specialists do not commit implicitly. Stage
only approved implementation and OKF, preserving unrelated staged/user changes.
If spec artifacts were temporarily tracked for handoff, the future controller must
remove their paths from the index before the final commit while retaining local files.
Confirm the resulting diff contains no active spec artifacts and obtain the hash
only after commit success. Never push, merge or deploy automatically.

After the commit, Archivist stores deduplicated operational knowledge in Engram
with that hash and records outcomes in memory.md. Reuse recorded persistence results
on retries to avoid duplicating entries. Engram holds learnings, debugging history,
gotchas and reusable decision rationale; OKF holds curated current project structure,
capabilities and architectural definitions. Do not promote feature artifacts wholesale.

If required knowledge tools or the OKF skill are unavailable, retain candidates and
report the blocked action. Do not mark the required persistence complete or silently
archive. No Engram integration, OKF skill or bundle is implemented by this contract.

The final archive operation is mechanical: the plugin moves Open/<spec> intact to
Archived/<spec>, after required gates and persistence. It does not reassess content
or select knowledge. A destination collision or failed move is reported as blocked;
do not overwrite an existing archive. No plugin enforcement or Git-index manipulation
is implemented here.
