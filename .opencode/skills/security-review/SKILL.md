---
name: security-review
description: Assess security concerns in an assigned implementation diff against its approved plan and evidence during Reviewer work. Records scoped findings in review.md; does not perform broad audits or modify implementation.
---

# Scoped security review

Execute within Reviewer, not a separate agent. Read [the shared workflow](../../workflow.md)
and the assigned proposal, design, tasks, implementation evidence and diff.

## Review boundary

Inspect only the changed code and relevant files/tests within the approved scope.
Do not perform codebase-wide exploration, external research, exploit execution or
access to secrets. Request missing dependencies, threat assumptions or evidence
through Orchestrator. This skill does not add permissions or bypass the reviewer's
shell restrictions.

## Assessment

- Identify changed trust boundaries, exposed inputs, credentials, sensitive data
  flows and authorization decisions. Focus on risks introduced or affected by the change.
- Where relevant, examine authentication and authorization, input validation and
  injection, secret disclosure, sensitive logging, unsafe external requests or file
  access, and failure handling. Do not force irrelevant checklist sections onto a change.
- Compare security requirements and design constraints with the actual implementation
  and supplied tests. Distinguish observed behavior from assumptions.
- For concrete issues, record the affected task/criterion, path, evidence, exposure
  conditions, impact and suggested correction. Do not invent exploitability when
  dependencies or deployment facts are unavailable.
- Mark missing evidence as unverified and request the specific information needed.
  An absence of findings is not proof that the whole project is secure.

## Persistent result

Write a security section in the assigned review.md. Include assessed scope,
applicable checks, findings with stable IDs and impact, evidence, and limitations.
Retain resolved findings and recheck results on later passes. A security defect or
unresolved required security check contributes to changes-required rather than
being silently accepted. Report unavailable verification as a limitation.

Append reusable operational candidates to memory.md with role and evidence; do
not store them directly in Engram or copy sensitive material.
Return a brief security summary and finding references to Reviewer. Do not approve
the workflow, dispatch repairs, commit, deploy, archive or modify implementation.
The future controller validates artifact/state gates, not the correctness of this
security assessment.
