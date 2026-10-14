# Engineering knowledge profile

This is a recommended organization for bundles produced by okf-maintenance.
OKF does not mandate these folders or type names. Preserve a suitable existing
taxonomy within knowledge/; create categories only when actual content needs them.

## Base categories

| Directory | Purpose | Suggested concept types |
| --- | --- | --- |
| `architecture/` | System boundaries, components, dependencies and inter-system flows | Architecture, Component |
| `design/` | Internal module design, contracts, interfaces and implementation patterns | Design, Interface |
| `stack/` | Languages, frameworks, databases, relevant versions and compatibility constraints | Technology |
| `tools/` | Development tools, supported setup and agreed usage | Tool |
| `decisions/` | Structural choices, context, alternatives, consequences and supersession | Decision |
| `domain/` | Business concepts, glossary, rules and invariants | Domain Concept, Business Rule |

Architecture describes how the system is divided and connected. Design explains
how a component works internally. Stack records the technologies it runs on;
tools records how contributors work with it. Cross-link these views instead of
repeating the same explanation in several folders.

Decisions explain why an approach was selected. Current architecture and design
describe the resulting system and link back to relevant decisions. A superseded
decision may remain as a deprecated concept with a link to its replacement.

## Categories selected by need

| Directory | Add when the project has |
| --- | --- |
| `api/` | Public or internal API contracts needing curated context |
| `data/` | Schemas, models, data flows or business metric definitions |
| `security/` | Established trust boundaries, access models or security requirements |
| `testing/` | A maintained testing strategy, environments and acceptance criteria |
| `operations/` | Approved, current deployment, recovery or maintenance procedures |

Do not copy full OpenAPI, SQL schemas or tool manuals when a maintained source
already exists. Link to the source and document the context that it omits.
Keep secrets and credentials out of every category.

## Knowledge destinations

- OKF: curated, durable descriptions, current policies and approved procedures.
- Engram: operational experiences, troubleshooting findings, errors and gotchas.
- Task/spec artifacts: temporary proposals, execution notes and review evidence.

A lesson can motivate a proposed documentation update. It becomes durable OKF
content only after checking the current evidence and obtaining any publication
approval required by the host project. This skill does not persist Engram entries.

## Navigation and maintenance

The root index describes the bundle's purpose and lists existing category indexes.
Each category index links to its actual concepts with one-line descriptions.
Do not advertise empty categories as implemented knowledge.

Use lowercase filenames with hyphens. Prefer stable concept paths: paths are OKF
concept identities. On a move, inspect and update affected bundle links and report
external references that cannot be updated locally.

An optional `log.md` records meaningful documentation changes, newest first, with
`## YYYY-MM-DD` headings. It is neither an incident diary nor an execution log.
Version control may provide sufficient history; do not create a log by default.

Review freshness when underlying code, dependencies, policies or decisions change.
Use source-specific review deadlines instead of assigning a universal expiry date.
Keep unconfirmed proposals visibly distinct from established project behavior.
