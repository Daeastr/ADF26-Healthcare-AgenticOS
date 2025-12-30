# Phase 5 — Tamper-evident ledger + evidence packaging

## Objective
Implement the tamper-evident ledger concept and define portable evidence bundles for audit/regulatory review.

## Key build activities
- Implement hash-chained event/audit records.
- Define signing keys, rotation, and verification.
- Define evidence bundle packaging (export format, redaction).
- Optional anchoring strategy (e.g., periodic anchoring to external store).

## Risks
- Ledger complexity and operational burden.
- Key management failures.
- Evidence bundles contain unnecessary PHI.

## Oversight checks applied
- Security review: key management and tamper resistance.
- Privacy review: redaction and minimization.
- Governance review: retention and access.

## Judge decisions (J1/J2/J3)
- **J1:** Ledger verifiability and integrity properties.
- **J2:** Break-glass/audit events correctly included.
- **J3:** Evidence bundles reproducible and exportable.

## Exit criteria
- Ledger MVP implemented and verified.
- Evidence bundle format documented and tested.
- Key rotation plan defined.
