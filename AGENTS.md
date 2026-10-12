# Seed Meta-Harness

Portable engineering capabilities. `.opencode/` is the executable OpenCode canon;
`.codex/` is its adaptation. OpenCode loads the selected role's system prompt from
`.opencode/agents/`. This shared file does not assign Orchestrator to other runtimes.

## Execution contract

The SDD controller is the sole authority for current state and authorization.
Artifacts contain work, evidence and recovery notes; historical stage logs and
checkboxes never establish gates. Never edit controller metadata to bypass them.
Each specialist already knows its deterministic inputs/outputs under
`specs/open/<spec>/`; archive is `specs/archived/<spec>/`. Use lowercase artifact
names. One spec may be open; preserve existing work and unrelated changes.

Orchestrator routes and coordinates with minimal context. Its loaded contract
contains Maintainer/SDD routing and plugin operations. An explicit SDD start request
requires clarified intent, then create and the returned assignment or blocking reason.
Do not investigate infrastructure, reports or memory merely to start. Local changes
and absence of a PR do not block creation. The plugin validates branch and open spec.
Each delegation explains why called, where the work stands and what to do. Explorer
receives broad initial context; subsequent roles receive concise evolution and use
their deterministic artifacts. No raw-document handoff substitutes for context.
Specialists execute their authorized assignment from their own artifacts; they do
not reconstruct workflow state or reload another role contract. Report concerns to
Orchestrator; only a material impediment blocks the assignment.

Plan and implementation require explicit user approval in ordinary conversation.
Reviewer pass does not authorize commit or Archivist. New permanent knowledge also
requires approval before publication. Only Archivist persists the exact selected
candidates in Engram, independently of Git. No commit references or SHA belong in
Engram entries. Git is separate and user-requested. No human approval commands,
content-hash gates, automatic push, merge or deployment.

## Shared limits and optional references

Every Markdown file must be at most 400 lines. Split linked supporting files without
losing evidence. Preserve user configuration and unrelated changes. Use explicit
approved paths for commits; never stage the whole repository implicitly.

Tools and skills load only when relevant to the assigned operation, not as a universal
preflight. CodeGraph is optional; use repository-native tools if unavailable. Engram
is the adoption memory foundation; CodeGraph and Plane are selectable integrations.
No CodeGraph hooks, scheduled jobs or automatic sync integrations.

Installation and troubleshooting: [Windows setup](docs/tools/windows.md).
Overview: README.md. Detailed workflow/plugin documentation is reference material,
not mandatory startup reading. OKF methodology documentation and remote memory
synchronization are outside the current implementation.
