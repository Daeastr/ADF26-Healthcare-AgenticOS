# Phase 8 — Production Orchestration Pilot (Bed Flow + Medication Workflow)

## Objective
Deploy controlled autonomy with explicit human checkpoints.

## Key build activities
Care-path state machines; pilot workflows; override capture; safe degradation modes; latency/SLO instrumentation.

## Risks
Workflow brittleness; clinician burden; latency.

## Oversight checks applied
J1 high-risk automation constraints; J2 SLO + fallback; J3 avoid sprawl.

## Judge decisions

### J1: Conditional Pass
Medication actions remain advisory until validated thresholds met.

**Remediation:** enforce advisory-only mode for defined action classes.

### J2: Conditional Pass
Must have explicit fallback modes (read-only, queue, advisory).

**Remediation:** implement degradations and chaos tests.

### J3: Pass
Focused pilot supports product integrity.

## Exit criteria
Two workflows live in pilot; measured overrides; no critical incidents; SLOs met.

---
