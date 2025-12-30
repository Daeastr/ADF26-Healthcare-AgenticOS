# Phase 4 — Interop Data Plane (FHIR Syscalls) + Conformance Gates

## Objective
Provide standardized, policy-mediated access to FHIR operations.

## Key build activities
Integrate microsoft/fhir-server as reference; syscall wrapper; conformance test suite; audit linkage for all reads/writes.

## Risks
FHIR profile drift; server-specific coupling.

## Oversight checks applied
J1 access logging; J2 reliability/idempotency; J3 avoid feature parity trap.

## Judge decisions

### J1: Conditional Pass
Must log purpose-of-use and decision basis per call.

**Remediation:** enrich audit with policy decision references.

### J2: Pass
Layering + tests reduce drift risk.

### J3: Conditional Pass
Ensure pluggable FHIR backend; focus on syscalls not features.

**Remediation:** create backend abstraction contract + replacement test.

## Exit criteria
FHIR syscalls operational; conformance suite passing; audits linked to policy decisions.

---
