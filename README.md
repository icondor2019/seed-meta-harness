# Seed Meta-Harness

A portable, agent-agnostic collection of engineering practices, canonical definitions, and validated harness-specific reference implementations. Codex is an initial consumer, not the source of truth.

## Propósito

El Meta-Harness estandariza el conocimiento compartido y ofrece prácticas de ingeniería reutilizables, sin imponer una única forma de desarrollar software.

Esto permite mantener una base común en el equipo, respetar los flujos maduros que ya funcionan y adoptar nuevas capacidades de manera gradual, según las necesidades de cada proyecto.

La fuente canónica se mantiene en `.agents/`. OKF 0.2 y Engram forman la base compartida para los proyectos que adopten el estándar; SDD, los subagentes y las integraciones adicionales se adoptan de forma modular. Las implementaciones de referencia para Codex, OpenCode y otros entornos deberán mantenerse vinculadas y verificadas contra el canon.

## Architectural principles

- **Isolated agents:** Orchestrator, Explorer, Planner, Builder, Reviewer, and Archivist are separate agents with independently configurable models and contexts.
- **Deterministic SDD transitions:** an external plugin gates progress by required artifact **existence**, workflow state, and human approval; it does **not** judge artifact content.
- **Branch-scoped work:** at most one active spec per feature branch. Active artifacts may travel in that branch; archived artifacts are not tracked in Git. `main` must not receive active specs.
- **Distinct knowledge systems:** OKF 0.2 for curated living project documentation; Engram for development learnings, errors, and gotchas; SDD artifacts for temporary feature execution.
- **Reconstructible code navigation:** CodeGraph may support local exploration without an always-on watcher/daemon, but it must not be required in cloud.
- **Portability first:** no optional MCP, task manager, or external persistence service may become a prerequisite for the core SDD workflow.

## Project tracking

Architecture and staged implementation tasks are maintained in [Plane — Meta-Harness SDD](https://app.plane.so/icondor/projects/1d47b74b-6a73-444e-9b72-434d62d9a62c/).

Project work and its current status are tracked in Plane. The canonical specification remains independent of any single runtime.
