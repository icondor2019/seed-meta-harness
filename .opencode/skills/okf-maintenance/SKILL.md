---
name: okf-maintenance
description: Create, update, organize and validate OKF 0.2 bundles for curated engineering documentation, preserving existing project conventions and distinguishing documentation from operational memory.
---

# OKF engineering documentation

Maintain a portable knowledge bundle of Markdown concepts with YAML frontmatter.
Use the official OKF 0.2 specification as the format authority. The engineering
taxonomy below is a recommended project profile, not an OKF requirement.
This skill requires no cloud service, MCP server or particular agent workflow.

## Choose the operation

- Bootstrap: inspect existing documentation, identify the intended bundle root and
  reuse relevant documents before creating new concepts.
- Update: inspect the affected concepts and their sources, make a focused change,
  and update navigation when concepts are added, moved or deprecated.
- Audit: report format failures separately from quality, freshness and coverage
  concerns. An audit does not imply permission to rewrite everything.
- Migrate: preserve original meaning, unknown metadata and useful links; prefer
  v0.2 provenance fields while retaining legacy information when attribution is unknown.

Use `knowledge/` as the current documentation bundle and `knowledge/index.md` as
the agent entrypoint. Read [bootstrap and migration](references/bootstrap-migration.md)
for empty repositories, code without docs or existing documentation. Migrate the
complete agreed scope; originals may remain only as superseded historical copies.
Keep unrelated documentation and user configuration intact. Do not transform
every Markdown file in the repository into an OKF concept.

## Organize and write

Read [the engineering profile](references/engineering-profile.md) when choosing
folders or deciding where knowledge belongs. Read
[the templates](assets/templates.md) when creating concepts or indexes.

1. Establish the scope from the request and the current project. Inspect relevant
   code, configuration and authoritative documentation; distinguish evidence from
   assumptions and proposals.
2. Create one coherent concept per file. Reuse existing concepts and link to
   authoritative schemas or configuration instead of duplicating them wholesale.
3. Add parseable YAML frontmatter with a nonempty string `type`. Prefer useful
   `title` and `description`; include optional metadata only when supported.
4. Express relationships using standard Markdown links and explanatory prose.
   Resolve bundle-root links against the bundle, not the filesystem root.
5. Maintain a root `index.md` and indexes for populated categories. List links and
   concise descriptions so readers can discover content progressively. These
   indexes are our profile recommendation, not a core conformance requirement.
6. Keep each Markdown file at most 400 lines. Split concepts along meaningful
   boundaries and link the resulting documents. Create no empty folder scaffolds.

## Provenance, trust and lifecycle

- Record actual supporting materials in `sources`, with a `resource` per entry.
  Use source IDs and Markdown footnotes for claims needing precise attribution.
- `generated` records authorship, not correctness. Use a real producer identity
  and an actual timestamp; do not guess a model version or original author.
- `verified` is a list of verification records. Add a record only after the named
  actor actually checked the relevant content. Never invent human review or treat
  user approval to create files as verification of their factual contents.
- A syntax check proves syntax only; it does not establish semantic verification.
- Use `status: draft` for proposed or unconfirmed content. Use `stable` for
  established current knowledge and `deprecated` when superseded. These are our
  preferred lifecycle terms; preserve existing extensions.
- Use `stale_after` when there is a defensible review deadline. Timestamp-valued
  metadata uses ISO 8601 datetimes with an explicit UTC offset.
- When a substantive change invalidates verification, remove the now-inapplicable
  records from the current document; retain history through version control.
  Do not refresh verification timestamps automatically.

Trust fields remain optional for core OKF conformance. Expiry and deprecation are
signals for review, not malformed documents. Do not add a numerical confidence
score or access-control meaning to them.

## Validate and report

Check the bundle scope only:

- Each concept is UTF-8 Markdown with parseable YAML and a nonempty string `type`.
- Reserved `index.md` and `log.md` files follow their specified structures.
  Indexes have no frontmatter except the permitted root version declaration.
- If optional structured metadata is present, check its shape against the official
  specification. Report optional-field issues separately from core conformance.
- Identify unresolved local links, missing recommended metadata, expired concepts
  and unsupported claims as distinct findings. Unknown types/keys, missing indexes
  and broken links alone must not cause core conformance rejection.
- Check the 400-line project limit separately from OKF conformance.

Use an available YAML parser or compatible validator; inspect its rules before
equating its exit code with OKF conformance. Report unperformed checks honestly.
No mandatory package installation, CI integration or external synchronization is
needed. Installations and integrations require their own task scope.

Summarize changed paths, validation performed, evidence gaps and any review needed.
Do not commit, publish, persist Engram entries or modify SDD state through this skill.

## References and boundaries

Authority: [official OKF 0.2 specification](https://github.com/GoogleCloudPlatform/open-knowledge-format/blob/main/SPEC.md).
Context: [Google's trust-signals article](https://cloud.google.com/blog/products/data-analytics/okf-v0-2-adds-trust-signals).
Community inspiration: [Fabricio Telles's OKF skill](https://github.com/fabricioctelles/skills/blob/main/skills/okf-open-knowledge-format/SKILL.md).

The community implementation informs the create/update/audit modes and progressive
references; this skill is independently written. Resolve differences in favor of
the official specification. The annotated guide at https://okf.md/spec/ is secondary.

Attested Computations are outside the default engineering profile. If requested,
read their official type-specific requirements before authoring them; generic
concept validation is insufficient. Do not execute computations merely to document
them or store runtime receipts in the knowledge bundle.
