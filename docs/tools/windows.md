# Windows tools: installation and first repository start

Engram is the required memory foundation. CodeGraph and Plane are optional for
projects adopting this template; all three are enabled here. Disable or remove
unselected entries from `opencode.json` when adopting. Preserve existing settings.
The descriptive inventory is [catalog.json](../../.opencode/tools/catalog.json);
OpenCode reads [opencode.json](../../opencode.json), not that catalog.
This guide is operational documentation, not a completed OKF 0.2 bundle.

## Prerequisites

Use PowerShell on Windows. Install Git from https://git-scm.com/download/win
if missing. For the npm installation route install Node.js LTS from
https://nodejs.org/ (includes npm). Node 24.14.1 and npm 11.11.0 are present here.
Use `npm.cmd` if PowerShell execution policy blocks npm.ps1; do not weaken the
machine execution policy. Open a new terminal after changing PATH.

```powershell
Get-Command git, node, npm.cmd, engram, codegraph, opencode -ErrorAction SilentlyContinue
# Install runtime only if absent:
npm.cmd install -g opencode-ai
```

OpenCode is the runtime, not a fourth MCP. Its launcher was found on this computer;
no OpenCode commands or model-backed tests were run for MHSDD-3.
Configuration syntax: https://opencode.ai/docs/mcp-servers/.

## Engram

Official source: https://github.com/Gentleman-Programming/engram.
Simplest Windows route: open the official
[Releases](https://github.com/Gentleman-Programming/engram/releases), choose the
Windows asset matching your CPU (normally amd64/x64), download and extract it
into a user-owned tools directory. Add the directory containing `engram.exe` to
your user PATH through Windows Environment Variables. Reopen the terminal and run
`engram version`. Prebuilt binaries avoid installing Go or compiling from source.
Use the release's own instructions if asset packaging changes.

Here the existing binary is `C:\Users\Dell\go\bin\engram.exe`, version 1.15.1.
Do not copy that machine-specific path into consumers' configurations.
`engram mcp --tools=agent` is the installed version's stdio startup command;
OpenCode starts it itself. Do not run `engram serve` as a prerequisite: that is
the separate HTTP API. Default data lives under `~/.engram`; `ENGRAM_DATA_DIR`
can override it. Project detection uses repository identity/current directory;
use `ENGRAM_PROJECT` only when an explicit stable project name is needed.

No cloud configuration or automatic sync is installed. Follow the selected
version's official guide for any later opt-in sharing. Verify persistence before
claiming it works. Operational guidance is in the
[Engram skill](../../.opencode/skills/engram-usage/SKILL.md); the
[Gentle-AI guide](https://github.com/Gentleman-Programming/gentle-ai/blob/main/docs/engram.md)
is a supplementary source, not a replacement API contract for the installed version.

## CodeGraph

Official source: https://github.com/colbymchenry/codegraph.
The version selected for this task is 1.6.2. With Node/npm installed:

```powershell
npm.cmd install -g @colbymchenry/codegraph@1.6.2
```

The npm package selects a platform package with a bundled runtime. This route
does not require Python, uv, Go or a Rust build toolchain. If download/install
fails, check registry access, proxy and availability of the platform package;
do not assume a missing compiler is the cause. The official repository also
offers a standalone PowerShell installer for machines without npm; inspect its
script and release before use. Do not run `codegraph install`: the project MCP
configuration is already supplied, and that command can change other agents.

In a new terminal, from each repository root, bootstrap once:

```powershell
$env:CODEGRAPH_NO_DAEMON = '1'
$env:CODEGRAPH_NO_WATCH = '1'
codegraph init
```

This first initialization creates `.codegraph/` and builds the initial index.
It is deliberately separate from subsequent refreshes. Do not add sync hooks,
watchers, scheduled tasks or startup scripts. Afterwards, humans or agents refresh
only when needed with:

```powershell
codegraph sync --quiet
if ($LASTEXITCODE -ne 0) { throw 'CodeGraph refresh failed; check installation and initial index.' }
```

`sync --quiet` requires an initialized repository and can fail silently. The local
index is rebuildable and ignored by Git. Missing/unusable graph data must not
block native repository search.

### Startup exception and Windows windows

The MCP starts with `serve --mcp --no-watch`, `CODEGRAPH_NO_WATCH=1` and
`CODEGRAPH_NO_DAEMON=1`. These disable the continuous file watcher and detached
shared daemon. Inspection of the installed 1.6.2 engine confirms that connection
still invokes catch-up synchronization. Fully manual index updating is therefore
not guaranteed by this upstream version. No local patch was installed.

On Windows, CodeGraph or its child processes may show console windows/logs during
startup or initial indexing. That can be surprising on a first project; correlate
them with your explicit OpenCode/CodeGraph launch and the installed executable
path. A window alone neither demonstrates malware nor proves that a process is
safe. This setup aims to reduce background activity; it does not guarantee zero
windows. Close OpenCode to end its MCP session. Persistent unexpected activity
needs inspection of the actual process command/path before taking action.
Functional process cleanup and window behavior remain for your terminal test.

Source controls: upstream `src/mcp/index.ts`, `src/mcp/engine.ts`,
`src/sync/watch-policy.ts` and `src/bin/codegraph.ts`. Consult the
[usage skill](../../.opencode/skills/codegraph-usage/SKILL.md) for exploration.

## Plane

Official guide: https://developers.plane.so/dev-tools/mcp-server.
The hosted PAT connection needs no local server or Python/uv dependencies.
Create a PAT in Plane Profile Settings → Personal Access Tokens (or a workspace
access token with suitable permissions). The workspace slug is the segment after
`app.plane.so/`, e.g. `icondor`. Do not paste the token into chat or tracked files.

Set variables in the same PowerShell terminal that will start OpenCode:

```powershell
$planeSecret = Read-Host 'Plane token' -AsSecureString
$env:PLANE_PAT = [System.Net.NetworkCredential]::new('', $planeSecret).Password
Remove-Variable planeSecret
$env:PLANE_WORKSPACE_SLUG = 'icondor' # replace for your workspace
opencode
```

The child process inherits these variables. This session-only setup avoids putting
the token in shell history. Re-enter it in a new terminal; restart OpenCode after
changing credentials. OpenCode does not load `.env` automatically. `.env` and
`.env.local` are ignored as a precaution, not used as a secret loader.
Missing variables prevent a usable Plane connection; the Codex connector's login
does not supply OpenCode credentials. Never print the token when diagnosing.

Native config uses `https://mcp.plane.so/http/api-key/mcp`, `oauth: false`,
`Authorization: Bearer {env:PLANE_PAT}` and
`x-workspace-slug: {env:PLANE_WORKSPACE_SLUG}`. The OAuth endpoint
`/http/mcp` is a different setup. No SSE, deprecated npm Plane server or stdio
bridge is needed. For private self-hosted Plane, use the official local-server
instructions instead; the hosted service cannot reach private instances.
401: check token/revocation; 403: check workspace permissions; missing workspace:
check slug/header. Revoke tokens in Plane if needed.

## User-run acceptance checks

Implementation performs static checks only; you run these from a separate terminal:

1. Confirm commands resolve after installation; run `engram version` and
   `codegraph --version`. Initialize the graph once as above.
2. Supply Plane variables, then run `opencode mcp list` and launch `opencode`.
   Verify all three servers connect; record any startup windows and failures.
3. Ask Engram for project memory. If desired, explicitly save/retrieve/delete a
   disposable test observation; do not mistake tool discovery for persistence.
4. Query CodeGraph for an existing symbol/file. Edit a relevant code file, run
   `codegraph sync --quiet`, and repeat the query; ensure refresh succeeds.
5. Ask Plane to list projects and read MHSDD-3; this requires no external writes.
6. Close OpenCode and inspect any remaining CodeGraph processes/windows. Report
   observed behavior before declaring cleanup or manual-refresh guarantees.

Recorded implementation evidence: npm installation succeeded for CodeGraph 1.6.2;
Engram help reported 1.15.1; OpenCode launcher was detected. MCP connectivity,
memory persistence, graph initialization and Windows process behavior were not
tested by the implementation agent. The user subsequently confirmed that OpenCode
opens the files and loads the agents and all three MCPs correctly. Memory
persistence, manual refresh and process cleanup were not separately reported.
No credentials were requested, printed or copied from existing user settings.

## Repository bootstrap reference

Moved from AGENTS.md to keep normal agent startup small. Consult this section only
for initial setup or a concrete tool failure; it is not an SDD preflight.


Engram is required for adoption; CodeGraph and Plane are selectable by consumers.
This repository enables all three in `opencode.json`. Git is a local prerequisite;
GitHub MCP is optional. Inventory: [catalog.json](../../.opencode/tools/catalog.json).

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
Load the relevant tool skill only when actually using that capability.
