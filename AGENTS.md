# Seed Meta-Harness

Portable engineering capabilities for agent-assisted software development.
Repository overview and documentation status: `README.md`.
`.opencode/` contains the executable canon; `.codex/` contains the Codex adaptation.
OKF 0.2 is the intended curated documentation format; its bundle is not created yet.
Knowledge and memory are shared foundations; SDD and subagents can be adopted modularly.
Discover the capability relevant to the current request; reading this file does not
automatically assign the Orchestrator role.

Mandatory documentation limit: 400 lines per Markdown file, including this file,
agent definitions, skills, project documentation and spec artifacts. Split larger
documents into linked supporting files without dropping evidence or required entries.
CodeGraph is optional: use it when available in the execution environment; otherwise
use repository-native tools. Agent roles and routing: `.opencode/workflow.md`.

## Tools and first start (Windows)

Engram is required for adoption; CodeGraph and Plane are selectable by consumers.
This repository enables all three in `opencode.json`. Git is a local prerequisite;
GitHub MCP is optional. Inventory: `.opencode/tools/catalog.json`.
Installation and troubleshooting: [Windows setup](docs/tools/windows.md).

Install missing tools only; preserve existing user configuration:

```powershell
# Engram: download the Windows release binary, extract and add its folder to PATH:
# https://github.com/Gentleman-Programming/engram/releases
# CodeGraph (Node/npm already installed):
npm.cmd install -g @colbymchenry/codegraph@1.6.2
# OpenCode runtime, only if missing:
npm.cmd install -g opencode-ai
```

Open a new terminal in the repository after changing PATH. Before first launch,
follow the setup guide to supply `PLANE_PAT` and `PLANE_WORKSPACE_SLUG` in that
terminal. OpenCode does not automatically load a `.env` file.

```powershell
$env:CODEGRAPH_NO_DAEMON = '1'
$env:CODEGRAPH_NO_WATCH = '1'
# First-time bootstrap only (builds the initial index):
codegraph init
# Subsequent refreshes, explicitly by human or agent:
codegraph sync --quiet
opencode
```

Do not install CodeGraph hooks, scheduled jobs or automatic sync integrations.
The configured MCP disables daemon and watcher; version 1.6.2 still reconciles
the index on connection. See the guide for this exception and Windows windows/logs.
Load `.opencode/skills/codegraph-usage/SKILL.md` for graph exploration and
`.opencode/skills/engram-usage/SKILL.md` for persistent operational memory.
