# Bootstrap and complete migration

## Starting points

- Empty repository: obtain purpose, scope and known decisions from the user. Create
  only supported concepts; do not invent architecture or dependencies.
- Code without docs: inspect bounded code, configuration and tests. Document observed
  behavior and distinguish inferred intent from confirmed decisions.
- Existing docs: inventory the complete agreed documentation scope. Adapt coherent
  small documents directly and split large ones into independently consultable concepts.

## Single current source

knowledge/index.md is the agent entrypoint. Originals coexist only during migration.
At completion remove them from current documentation paths or move them to an
explicitly historical location outside the bundle. Git ignore policy for that archive
is project-specific. Historical copies are superseded, not another current authority.
Update agent instructions, current indexes and incoming links to knowledge/.
This concerns migrated prose; executable schemas and code remain supporting evidence.

## Large corpora

Inventory paths, sizes, headings and links with local tooling first. Use a compact
mapping, not an extensive exploration report. Knowledge Curator owns bounded inventory
and transformation. Explorer currently requires SDD and Maintainer prohibits OKF writes;
neither is required for faithful documentation migration.

The coordinator schedules fresh economical subagent contexts, usually one source file
per invocation. Group small related files when useful. Process oversized sources by
coherent sections with necessary surrounding context, never truncating material.
Do not perform mechanical bulk transformation in the primary session or silently
fall back to costly models. Report unavailable economical execution before starting.
Code analysis and semantic contradictions require separate evidence or user decisions.

Each assignment supplies sources/sections, exclusive destinations, taxonomy, checks and
only relevant prior results. Keep one writer active under current host-agent rules.
Workers return coverage, paths and issues rather than full documents. Consolidate
indexes and cross-batch links in a separate bounded Knowledge Curator assignment.

Keep temporary mappings in knowledge/migration/: root-linked index and small concepts
with `type: Migration Record`. Record source path/section, destinations, progress,
checks and unresolved issues. Split large mappings into linked files. Retire these
temporary records after completion through explicit allowed finalization operations.

## Completion

- Every source section has a destination or explicit user-approved exclusion.
- Important detail, examples and constraints survive; duplicate consolidation is
  traceable and contradictions are visibly recorded or resolved by an authorized decision.
- Concepts answer focused questions with context and links to dependencies. The
  400-line limit is a ceiling, not a target or an automatic slicing rule.
- Sample questions from different categories can find relevant concepts through indexes.
- Actual format/link checks and limitations are recorded.
- Originals are outside current discovery and instructions point to knowledge/index.md.
  Source moves/removals and entrypoint edits require an explicitly assigned allowed
  writer; migration stays incomplete until finalization is performed.

Editing or installing this skill does not authorize migrating its own repository.
