# Phase 3 — Identity, authZ, break-glass, and consent hooks

## Objective
Introduce user/service identities, authorization mapping, break-glass workflows, and consent/attestation hooks.

## Key build activities
- Define identity primitives (human, service, agent) and trust boundaries.
- Implement authZ mapping to policies.
- Add break-glass event flows and required justifications.
- Add consent/attestation references where applicable.

## Risks
- Identity ambiguity causing unsafe permissions.
- Break-glass misuse without sufficient friction and audit.
- Integrations (IdP/EHR) leaking PHI.

## Oversight checks applied
- Security review: authN/authZ, token handling, secrets.
- Privacy review: consent representation and minimization.
- Governance review: break-glass approvals.

## Judge decisions (J1/J2/J3)
- **J1:** Identity model consistent and mapped to events.
- **J2:** Break-glass requires justification + oversight.
- **J3:** Audit completeness for access and overrides.

## Exit criteria
- Identity model and authZ mapping documented.
- Break-glass flow implemented (at least nominally).
- Consent/attestation hooks specified.
