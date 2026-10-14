# OKF authoring templates

Adapt these examples; do not copy placeholder values into a live bundle.
No optional trust field is populated by default.

## Root index

```markdown
---
okf_version: "0.2"
---
# Project knowledge

Curated engineering documentation for this project.

- [Architecture](architecture/index.md) - System boundaries and components.
- [Tools](tools/index.md) - Development tools and supported usage.
```

List only existing categories. The root declaration is permitted; category indexes
use Markdown headings and lists without YAML frontmatter.

## Category index

```markdown
# Architecture

- [System overview](system-overview.md) - Components and their interactions.
```

## Concept

```markdown
---
type: Architecture
title: System overview
description: Components, boundaries and interactions of the current system.
status: draft
---
# System overview

Describe the system using inspected evidence. Identify unconfirmed details.

## Components and boundaries

Explain responsibilities and connect related concepts with Markdown links.

## Constraints

Document supported constraints and their rationale.
```

Replace generic body text with actual findings. A proposed design remains a draft
and must not be presented as the implemented system.

## Optional provenance and review metadata

```yaml
sources:
  - id: supporting-source
    resource: https://example.com/actual-supporting-document
    title: Supporting document
generated:
  by: process:actual-producer
  at: 2026-10-14T00:00:00Z
verified:
  - by: human:actual-reviewer
    at: 2026-10-14T01:00:00Z
stale_after: 2027-01-01T00:00:00Z
```

These identities, URLs and times are illustrative. Omit fields without actual
evidence. A review record requires a real review; a deadline needs a real reason.
For claim attribution, use `[^supporting-source]` in the body and a matching
Markdown footnote definition tied to the source ID.

## Decision body

Use `type: Decision` and appropriate title/description frontmatter, then document:

- Context and constraints.
- Decision and its current status.
- Alternatives considered and reasons for the choice.
- Consequences and affected concepts.
- Replacement decision, if superseded.

Use `status: draft` until the decision has actually been adopted. Do not invent
approval dates or reviewers from a request to draft documentation.
