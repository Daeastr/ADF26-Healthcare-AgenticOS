# Phase 1 — Kernel Contract & Clinical Action Taxonomy

## Objective
Define what the OS controls: action classes, policy bindings, audit invariants, harm signals.

## Key build activities
Canonical event model; action-risk taxonomy; immutable policy versioning; audit taxonomy; integrity model for logs.

## Risks
Wrong abstractions; missing regulatory requirements; later retrofits.

## Oversight checks applied

### J1 Compliance
HIPAA auditability, retention, minimum-necessary semantics

### J2 Technical
threat model, tamper evidence, failure modes

### J3 Strategic
kernel-first scope discipline

## Judge decisions

### J1: Conditional Pass
Add explicit HIPAA audit event taxonomy + retention/access rules.

**Remediation:** publish audit schema + retention controls.

### J2: Conditional Pass
Add integrity guarantees (hash chaining) + threat model baseline.

**Remediation:** implement tamper-evident ledger design.

### J3: Pass
Kernel-first prevents tool sprawl.

## Exit criteria
Signed kernel spec, audit taxonomy, threat model baseline; no judge “fail”.

---
