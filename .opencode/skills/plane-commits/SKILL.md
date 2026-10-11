---
name: plane-commits
description: Prepare task-linked Git commits and verify Plane reference formatting in pull requests before merge. Use for commits or PR linkage associated with Plane; does not authorize commits, pushes, merges or task-state changes.
---

# Plane task commits

## Commit convention

Use this subject format:

```text
[<PROJECT>-<NUMBER>] <Concise description of the delivered change>
```

The identifier belongs to the actual Plane work item being developed. Do not
hardcode MHSDD-2 for other work, invent identifiers or substitute a task title
for its identifier. Use an English imperative description unless the user supplies
a different exact subject. Describe the resulting change, not the session history.

Confirmed example for this repository:

```text
[MHSDD-2] Define runtime-agnostic agents
```

Preserve an exact subject provided by the user. Do not prepend a conventional-commit
type, change the brackets or append closing keywords unless requested.

The commit format is a repository traceability convention. It does not by itself
activate Plane PR state automation. Use it for task-owned follow-up and conflict
resolution commits as well, but do not label unrelated changes with the task ID.
Do not rewrite existing or shared commits merely to normalize their subjects.

## Pull request linkage and merge checks

Plane's documented automation reads a bracketed work item ID in the PR title or
description. Require `[<PROJECT>-<NUMBER>]` in at least one of those fields before
merge; prefer a title such as `[MHSDD-3] Configure MCP tools and document Windows setup`.
A branch name, an identifier in a commit, or an unbracketed reference is insufficient
for the documented PR state automation. An unbracketed ID links only a reference.

Before an authorized merge, inspect the actual GitHub PR title and description,
including after conflict resolution or when GitHub derives a title from a branch.
Check for Plane App's linkage confirmation comment and, when accessible, the
project's PR state mapping, including merged -> Done. Do not claim the integration
or mapping is configured solely because an MCP connection works. If settings are
unavailable, report that verification limit. Correct PR metadata only when authorized.

After a merge, verify both GitHub merged status and the actual Plane work item
state/activity. A successful merge is not evidence that the automation ran.
If Plane did not transition, report the discrepancy and inspect PR reference,
mapping and integration delivery; do not assume an unformatted commit vetoed it.
Do not force a status change, rewrite history or replay events without authorization.
Editing an already merged PR is not a guaranteed way to replay its merge event.

Official reference:
https://docs.plane.so/integrations/github#reference-formats

### Observed failure: MHSDD-3

GitHub PR https://github.com/icondor2019/seed-meta-harness/pull/2 merged to main
with four commits. One commit used `[MHSDD-3]`; the PR title was
`Codex/mhsdd 3 mcp catalog` and its description was empty. Plane remained Backlog,
with no state transition in the retrieved activity. This confirms a missing
documented PR automation reference, not a rule requiring every commit to match.
Integration mapping and delivery logs were not available in these tool reads;
the missing reference is an evidenced defect, not a complete webhook diagnosis.

## Resolve the task and scope

Use the identifier already established in the conversation. If task identity is
unclear, inspect the relevant Plane work item through the available connector.
Ask only when the work cannot be mapped confidently. If Plane is unavailable,
use an explicitly supplied identifier and report that live verification was unavailable.

Inspect the branch, working tree and index before staging. Respect the authorized
file scope; a task identifier does not authorize committing all repository changes.
Stage explicit paths and inspect the staged diff. Preserve unrelated staged and
unstaged work. If the index contains unrelated changes, keep them out of this
commit without discarding them; report a blocker if isolation is uncertain.

Do not bundle unrelated tasks under one identifier. Separate their commits when
authorized, or clarify the intended grouping. Follow the applicable SDD approval
and artifact-exclusion contract when committing heavy-route work.

## Commit and verify

Create a commit only when authorized by the user or the applicable workflow.
Check the staged diff and required validation before committing. For multiline
messages, use a message file rather than shell-interpolated text.

After success, inspect the resulting commit's subject and paths and obtain its
hash. Report the hash, subject, included scope and work left outside the commit.
On failure, report the actual result; do not claim a commit exists. Never push,
merge, deploy or amend an existing commit implicitly.

## Plane state and progress

For this repository, task-state changes belong exclusively to the configured
repository merge automation. Never manually change the Plane status because a
commit was prepared, created or pushed. Creating a commit does not complete a task.

Bracketed commit subjects provide traceability; bracketed PR title/description
references enable the documented automation when the integration and mapping are
configured. Do not claim Plane received a commit or automation ran without evidence.
This skill does not configure repository integrations or implement automation.

When the user authorizes a Plane progress update, add a clearly separated progress
section or comment explaining changes, reasons, checks and pending work. Preserve
the initial description, title and status unless separately instructed otherwise;
this skill itself does not authorize external updates.

Keep Markdown files at or below the mandatory 400-line limit.
