# Phase 7 — SMART app integration patterns and UX guardrails

## Objective
Provide SMART on FHIR app patterns that interact safely with kernel decisions and evidence.

## Key build activities
- Define SMART launch context usage and redaction rules.
- Define UX patterns for showing justifications and evidence.
- Implement review/approval UI flows for high-risk actions.
- Define clinician feedback capture into events.

## Risks
- UX encourages over-trust in recommendations.
- SMART context handling exposes PHI.
- Approval workflows become unusable.

## Oversight checks applied
- Clinical usability review.
- Privacy review for SMART scopes.
- Governance review: approvals and accountability.

## Judge decisions (J1/J2/J3)
- **J1:** SMART integration follows kernel contracts.
- **J2:** UX clearly communicates uncertainty/limits.
- **J3:** Approvals and feedback are captured as auditable events.

## Exit criteria
- SMART integration guide published.
- UX guardrails documented and prototyped.
- Feedback loops implemented in events.
