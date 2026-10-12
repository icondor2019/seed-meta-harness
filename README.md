# Seed Meta-Harness

Portable engineering capabilities for agent-assisted software development.
**OpenCode is the executable canon and source of truth.** Codex is a reference adapter.

## Architecture

- Seven roles: Orchestrator is the primary agent; Explorer, Planner, Builder, Reviewer,
  Archivist and Maintainer are independent subagents with bounded contexts and configurable models.
- Markdown documentation, agent definitions, skills and spec artifacts must remain
  at or below 400 lines per file. Split larger content into linked supporting files;
  the controller checks the mechanical limit at gated operations.
- The deterministic OpenCode SDD plugin checks required artifact existence, workflow
  state and authorization. Agents and humans assess content. See the
  [implemented controller and its limits](docs/sdd-plugin.md).
- At most one active change per feature branch. Active artifacts can travel in Git;
  archives are local and main must not receive active changes. Specs remain local and excluded from Git.
- OKF 0.2 is for curated project documentation; Engram is for operational learnings.
  Project MCP configuration and operational guides are available; the OKF bundle
  and remote memory synchronization are not implemented here yet.
- OKF and Engram are shared foundations. SDD and subagents are optional capabilities
  for consuming projects. CodeGraph and Plane are optional integrations.
- Adoption is modular; consumers need not replace their existing development workflow.

## OpenCode canon (MHSDD-2)

`.opencode/agents/` contains the seven native Markdown agent definitions.
`docs/workflow.md` defines the heavy SDD route, persistent handoffs, approvals,
context boundaries and closure contract. Maintainer defines bounded light-route work;
its persistent recovery, knowledge receipts and controller gates remain pending.
Planner uses task-breakdown; Reviewer uses security-review from `.opencode/skills/`.
The existing agent contracts and skill were reused, with native YAML metadata added.
The previous `.agents/` definitions have been migrated, not maintained as a second canon.

The project entry configuration is `opencode.json`, with
`default_agent: "orchestrator"`. Start `opencode` in this repository to use it.
Agent files set primary/subagent mode explicitly. Orchestrator's task permission
allows only the six project specialists; each specialist denies further delegation.
Reviewer denies shell execution and edits except review.md and memory.md under
specs/open. Restriction to the currently assigned spec remains behavioral until
controller support exists. These tool restrictions are not
the SDD controller's operation gates and do not guarantee filesystem isolation.

Models are deliberately not pinned to a provider or account. To override a role,
set `model: provider/model-id` in its agent frontmatter. The primary agent uses the
configured session model; specialists inherit it unless overridden. Provider-specific
reasoning settings must match the chosen model. Actual model overrides remain untested.

Earlier discovery checks with OpenCode **1.15.3**, before the latest workflow and
Reviewer-permission changes (not repeated; runtime checks are reserved for the user):
- `opencode agent list` discovers Orchestrator as primary and the five specialists as subagents.
- `opencode debug config` resolves the default agent to Orchestrator.
- `opencode debug agent <name>` loads all six prompts and their task permissions;
  Reviewer then resolved full edit denial; its new scoped writes are not runtime-tested.
- `opencode debug skill` resolves task-breakdown to its canonical OpenCode path.

Not yet verified: model-backed delegation, actual separate child contexts, per-role
model/effort overrides, behavioral permission enforcement and the complete SDD cycle.
An earlier model-backed smoke test was rejected by automatic approval review because it
could transmit repository instructions/metadata to an external configured provider
without explicit approval of destination and payload. No model request was executed.
No OpenCode commands or model tests were run for the current workflow implementation
or the new Maintainer. Historical discovery covered the original six agents only.
Both skills pass structural validation; agent/config syntax and local links are
checked statically. These checks do not prove runtime permission enforcement.

Heavy changes use specs/open/<spec> with exploration.md, proposal.md, design.md,
tasks.md, implementation.md, review.md and memory.md. Planner persists proposal
before asking questions; Builder and Reviewer persist progress before returning.
Plan and implementation require separate textual human approvals. Archivist starts
only after implementation approval and proposes knowledge before permanent writes.
New knowledge needs exact textual candidate selection. Archivist persists only the
approved candidates, without Git/commit references; Orchestrator requests mechanical
archival to specs/archived/<spec>. Git is a separate user-requested operation. There is no automatic push or deployment.
The plugin implements gates and archival; Archivist supplies per-candidate memory receipts.
The Engram MCP connection is configured; its persistence behavior awaits user testing.

## Codex adaptation

`.codex/` is preserved. Its seven TOML files reference the OpenCode canon's Markdown
bodies, without treating OpenCode YAML as Codex settings. `.codex/orchestrator.md`
remains an opt-in primary-session adapter. The universal `AGENTS.md` does not
automatically activate it. Native OpenCode task/skill calls need Codex equivalents;
model IDs, reasoning settings and permissions are runtime-specific. Full adaptation
and fresh-session behavior are pending.
In particular, Codex Reviewer's read-only sandbox cannot yet write the mandatory
review artifacts; the adapter reports this mismatch rather than weakening permissions.

## Tool setup (MHSDD-3)

The repository configures Engram, CodeGraph and hosted Plane in `opencode.json`.
Engram is required for adoption; consumers choose whether to use CodeGraph and
Plane. See [Windows installation and first start](docs/tools/windows.md) and the
[descriptive JSON inventory](.opencode/tools/catalog.json). GitHub MCP remains optional.
CodeGraph 1.6.2 disables daemon and watcher here, but retains connection-time
catch-up; subsequent refresh guidance is `codegraph sync --quiet`.
Functional acceptance is performed by the user in a separate OpenCode terminal.

## Project tracking

Architecture and implementation tasks:
[Plane — Meta-Harness SDD](https://app.plane.so/icondor/projects/1d47b74b-6a73-444e-9b72-434d62d9a62c/).

Official references:
[Agents](https://opencode.ai/docs/agents/),
[configuration](https://opencode.ai/docs/config/),
[skills](https://opencode.ai/docs/skills/).

MHSDD-2 establishes the agents and first implementation; MHSDD-4 adds the controller.
The installer, updates, Engram synchronization and OKF bundle belong to other tasks.

## Deterministic SDD controller (MHSDD-4)

The auto-discovered OpenCode plugin exposes the sdd tool. All spec paths and
artifacts use lowercase. Human approval is ordinary user text in the conversation.
Native /sdd-status reads metadata directly without a model. There are no hash gates. See [operations, recovery and validation](docs/sdd-plugin.md).

Automated tests exercise local lifecycle and negative gates in disposable Git
repositories. A model-backed OpenCode conversation and the real human approval
interaction still need user acceptance; API loading alone is not that acceptance.

Repeatable capability scenarios and execution evidence are indexed in
[the capability test catalog](tests/capabilities/README.md). The MHSDD-4 interactive
initial interactive attempt failed; corrected behavior awaits a repeated acceptance run.
