# Phase 5 — Clinical Workflow Host Adapter v1 (OpenMRS Driver)

## Objective
Connect OS orchestration to real clinical workflows/events.

## Key build activities
Event ingestion; task/action proposal loop; human checkpoint enforcement; replay-safe processing; schema evolution discipline.

## Risks
Clinical disruption; semantic mismatch; operational instability.

## Oversight checks applied
J1 non-bypassable human gates; J2 resiliency; J3 workflow focus.

## Judge decisions

### J1: Conditional Pass
Mandatory human confirmation for high-risk actions must be enforced.

**Remediation:** encode action risk classes + required confirmation.

### J2: Conditional Pass
Need idempotency keys, backpressure, and replay controls.

**Remediation:** implement event idempotency + dead-letter handling.

### J3: Pass
Anchors system in clinical reality.

## Exit criteria
Safe propose/confirm/execute loop demonstrated for at least one workflow.

---
