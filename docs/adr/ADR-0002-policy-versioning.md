# ADR-0002: Policy Versioning

- Status: Accepted (scaffold)
- Date: 2025-12-30

## Context
ClinOps Kernel enforces policies that may change over time. For auditability and reproducibility, every decision must be attributable to the exact policy version evaluated at the time.

## Decision
- Policies are immutable once released.
- New policy changes create a **new version**.
- Every governed event must include `policy_id` and `policy_version` in the canonical envelope.
- Policy evaluation produces a structured result: `allow | deny | require-approval | break-glass` plus constraints.

## Version scheme
- `policy_id`: stable identifier (e.g., `bedflow.transfer.recommendation`)
- `policy_version`: monotonically increasing integer or semver string.

## Lifecycle
1. Draft (not enforceable)
2. Review (governance + security + clinical)
3. Release (immutable)
4. Deprecate (still resolvable for historical audit)

## Consequences
- Kernel must retain historical policy versions.
- Tooling needed to author/review policies.
- Auditors can reproduce decisions by replaying event + policy version.

## Alternatives considered
- Mutable policies with timestamps (rejected: weak reproducibility).
- External policy engine only (deferred: may integrate later but versioning rules still apply).
