---
name: plane-commits
description: Prepare or create a task-linked Git commit for a Plane work item using the agreed bracketed identifier convention. Use when committing work associated with Plane; does not authorize commits, pushes, merges or task-state changes.
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

The bracketed identifier is the agreed linking convention. Do not claim that Plane
received the commit or that merge automation ran without observing that result.
This skill does not configure repository integrations or implement automation.

When the user authorizes a Plane progress update, add a clearly separated progress
section or comment explaining changes, reasons, checks and pending work. Preserve
the initial description, title and status unless separately instructed otherwise;
this skill itself does not authorize external updates.

Keep Markdown files at or below the mandatory 400-line limit.
