# Seed Meta-Harness

Portable, lightweight, agent-driven software development harness. Initial target: **Codex local and Codex Cloud**.

## Architectural principles

- **Isolated agents:** Orchestrator, Explorer, Planner, Builder, Reviewer, and Archivist are separate agents with independently configurable models and contexts.
- **Deterministic SDD transitions:** an external plugin gates progress by required artifact **existence**, workflow state, and human approval; it does **not** judge artifact content.
- **Branch-scoped work:** at most one active spec per feature branch. Active artifacts may travel in that branch; archived artifacts are not tracked in Git. `main` must not receive active specs.
- **Distinct knowledge systems:** OKF 0.2 for curated living project documentation; Engram for development learnings, errors, and gotchas; SDD artifacts for temporary feature execution.
- **Reconstructible code navigation:** CodeGraph may support local exploration without an always-on watcher/daemon, but it must not be required in cloud.
- **Portability first:** no optional MCP, task manager, or external persistence service may become a prerequisite for the core SDD workflow.

## Project tracking

Architecture and staged implementation tasks are maintained in [Plane — Meta-Harness SDD](https://app.plane.so/icondor/projects/1d47b74b-6a73-444e-9b72-434d62d9a62c/).

Initial work starts with **MHSDD-11** (verify Codex runtime capabilities), followed by **MHSDD-2** (define the agent contracts) and **MHSDD-4** (deterministic workflow plugin).

> MCP status: project configuration and Windows setup guides are available (MHSDD-3); the user confirmed OpenCode loads files, agents and MCPs. Other implementation status is maintained separately.

## Tool setup (MHSDD-3)

The repository configures Engram, CodeGraph and hosted Plane in `opencode.json`.
Engram is required for adoption; consumers choose whether to use CodeGraph and
Plane. See [Windows installation and first start](docs/tools/windows.md) and the
[descriptive JSON inventory](.opencode/tools/catalog.json). GitHub MCP remains optional.
CodeGraph 1.6.2 disables daemon and watcher here, but retains connection-time
catch-up; subsequent refresh guidance is `codegraph sync --quiet`.
Functional acceptance is performed by the user in a separate OpenCode terminal.
