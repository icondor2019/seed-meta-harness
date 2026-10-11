---
name: task-breakdown
description: Create or revise tasks.md from a proposal, design and acceptance criteria during a Planner assignment. Produces a dependency-aware implementation checklist; does not implement tasks or advance the workflow.
---

# Task breakdown

Execute within the Planner's independent context, without creating another agent.
Read [the shared workflow](../../workflow.md) for persistence, approvals and state authority.
Runtime adapters own tool selection, model settings and plugin commands.

## Inputs

Read the assigned proposal.md, design.md, acceptance criteria, relevant Exploration.md
findings and existing tasks.md. Use the change directory and permitted output paths
provided by Orchestrator. Additional artifacts are inputs only when the configured
workflow requires them.

Planner must already have persisted proposal.md before this skill returns any
questions. Record unresolved requirements or design decisions there with stable
question IDs, then return them through Orchestrator. Do not invent scope or
disguise an unresolved design decision as an implementation task.

## Build the checklist

1. Extract outcomes and constraints. Reference acceptance criteria by their existing
   identifiers, or by artifact section and exact criterion if identifiers are absent.
2. Identify logical changes, interfaces and known target paths. When a path is not
   established, identify the owning component and unresolved location rather than
   fabricate a path.
3. Split work into units with a clear outcome and completion check. One logical
   unit may span multiple files; avoid a fixed file count or session duration.
4. Order tasks by dependencies and give each a stable identifier such as T01.
   Explicitly list dependencies. Group related work when helpful; do not impose
   fixed infrastructure, implementation, testing and cleanup phases.
5. Link tasks to acceptance criteria or necessary enabling work. Include validation
   with the work it proves, plus integration checks for behavior spanning components.
   Follow project testing conventions, including test-first sequencing when applicable.
6. Check coverage of included scope, exclusion of deferred work, and absence of
   missing or cyclic dependencies. Ensure Builder can execute without redesigning
   the feature. Report remaining blockers explicitly.

## tasks.md format

Use a checklist with enough context for an isolated Builder and Reviewer.
Optional grouping headings can organize longer lists:

```markdown
# Tasks: <change title>

Planning inputs: <proposal and design paths>

- [ ] T01 <concrete action and expected outcome>
  - Scope: <paths or owning component>
  - Depends on: none
  - Covers: <acceptance criterion reference or enabling rationale>
  - Done when: <observable completion condition>
  - Validation: <appropriate check and expected result>
  - Evidence: pending; Builder records actual result and reference when complete

- [ ] T02 <concrete action and expected outcome>
  - Scope: <paths or owning component>
  - Depends on: T01
  - Covers: <acceptance criterion reference>
  - Done when: <observable completion condition>
  - Validation: <appropriate check and expected result>
  - Evidence: pending; Builder records actual result and reference when complete
```

New tasks start unchecked. During revision, preserve identifiers and verified
progress for unchanged work. Do not reuse removed identifiers or retain completion
marks for materially different work. Report changed tasks and impacts on approval
or prior completion to Orchestrator.

Builder owns execution marks and evidence; Reviewer verifies them independently
in review.md without changing tasks.md. A checked box alone is not evidence.
On interruption, Builder resumes from tasks.md and implementation.md. Explicitly
include permitted code/test paths so downstream agents can work without broad
codebase exploration. Missing scope must return to planning rather than authorize
Builder or Reviewer to discover it independently.

## Persist and return

Write tasks.md to the assigned Specs/Open/<spec>/ directory. SDD artifacts stay in the change workspace;
do not promote them to operational memory or curated documentation.
Return completed, blocked or failed for the assignment, artifact path, coverage and
dependency summary, unresolved questions, and revision impacts when applicable.

Do not dispatch Builder, choose the next stage, register approval or directly edit
authoritative workflow state. Execute only plugin operations supplied for the
assignment and return their results. Orchestrator coordinates the next allowed step.
The plugin checks artifact existence, state and authorization; agents and humans
review checklist meaning and quality. Until the plugin exists, explicitly report
enforcement unavailable rather than fabricate plugin results.

## Inspiration

[agent-teams-lite sdd-tasks](https://github.com/Gentleman-Programming/agent-teams-lite/blob/main/skills/sdd-tasks/SKILL.md)
informs dependency ordering, actionable tasks and verification. This skill defines
our own artifact, persistence and orchestration contract.
