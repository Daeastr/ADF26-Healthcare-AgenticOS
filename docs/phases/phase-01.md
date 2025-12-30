# Phase 1 — Kernel contract + event model + audit baseline

## Objective
Establish the minimum governance-first specification set for ClinOps Kernel: canonical event model, kernel contract boundaries, baseline taxonomies (clinical actions + audit), initial threat model, and initial oversight/judge workflow.

## Key build activities
- Define **kernel contract**: responsibilities, interfaces, invariants, and enforcement points.
- Define **canonical event model** (ADR-backed): core event envelope, identifiers, causality, policy references.
- Define **clinical action taxonomy**: what "actions" the system can recommend/trigger, with severity and required oversight.
- Define **audit taxonomy**: what must be logged, minimum evidence bundle, retention expectations.
- Draft **threat model** covering misuse cases, PHI exposure, model risks, injection, escalation, insider threats.
- Draft **tamper-evident ledger** concept (hash chaining, signatures, anchoring strategy), not necessarily implemented.
- Create ADRs:
  - ADR: canonical event model
  - ADR: policy versioning

## Risks
- Over-specifying early and blocking iteration.
- Under-specifying and leaving gaps (no clear contract → unsafe drift).
- Misalignment with clinical reality (taxonomy too generic or missing key categories).
- Unclear division of responsibilities between kernel and agents.

## Oversight checks applied
- Security design review of event envelope fields and redaction rules.
- Privacy review for PHI minimization and linkability.
- Clinical safety review of action taxonomy severity mapping.
- Governance review of judge gates (J1/J2/J3) and escalation rules.

## Judge decisions (J1/J2/J3)
- **J1 — Spec coherence gate:**
  - Are kernel responsibilities explicitly bounded?
  - Are required event fields present and unambiguous?
- **J2 — Safety gate:**
  - Does taxonomy require human oversight / escalation? Are contraindications present?
- **J3 — Auditability gate:**
  - Is the evidence bundle sufficient to reconstruct decisions?
  - Is the ledger approach tamper-evident in principle?

## Exit criteria
- Kernel contract document complete and reviewed.
- Canonical event model ADR accepted.
- Policy versioning ADR accepted.
- Clinical action taxonomy and audit taxonomy drafted with review notes.
- Threat model drafted with prioritized mitigations.
- Tamper-evident ledger concept documented and mapped to events/audit requirements.
