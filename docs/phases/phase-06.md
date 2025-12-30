# Phase 6 — Governance Kernel v1 (Policy-as-Code + Explainability with PHI Controls)

## Objective
Make governance enforceable and explainable without leaking PHI.

## Key build activities
Policy engine; explainability ledger with redaction; immutable audit chain; policy change workflow with judge gating.

## Risks
PHI leakage in rationale; policy explosion; governance bottleneck.

## Oversight checks applied
J1 PHI minimization; J2 secure storage + key mgmt; J3 tiered governance.

## Judge decisions

### J1: Pass (after required design)
Only “explainability-by-reference” allowed; no raw PHI in rationale store.

**Remediation if violated:** block releases; enforce redaction tests.

### J2: Conditional Pass
Add encryption boundaries + rotation + secrets discipline.

**Remediation:** envelope encryption and key rotation plan.

### J3: Conditional Pass
Must implement risk-tiered policy review lanes.

**Remediation:** define low/medium/high risk policy change process.

## Exit criteria
Policies enforce decisions; explainability stored safely; policy change gate operational.

---
