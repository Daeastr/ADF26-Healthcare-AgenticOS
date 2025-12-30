# Phase 2 — Policy engine + versioning + enforcement points

## Objective
Define and implement the initial policy system: policy objects, versioning, evaluation, and enforcement points in the kernel.

## Key build activities
- Define policy schema (scope, actor, action, resource, constraints).
- Implement policy evaluation hooks at key kernel boundaries.
- Add policy versioning and migration strategy (per ADR).
- Add policy references into event envelope.

## Risks
- Policy complexity leading to inconsistent enforcement.
- Version sprawl and inability to reproduce historical decisions.
- Over-reliance on policy without usable authoring tools.

## Oversight checks applied
- Security review: authorization semantics and default-deny.
- Governance review: policy lifecycle, approvals, and rollback.
- Audit review: ensuring policy version is always recorded.

## Judge decisions (J1/J2/J3)
- **J1:** Policy schema complete and testable.
- **J2:** Safe defaults, break-glass constraints, least privilege.
- **J3:** Reproducibility of decisions given event + policy version.

## Exit criteria
- Policy schema finalized.
- Enforcement points documented and minimally implemented.
- Versioning and rollback procedures defined.
- Events reliably reference exact policy versions.
