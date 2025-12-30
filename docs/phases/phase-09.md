# Phase 9 — Evidence & Impact Plane (OMOP outcome loop)

## Objective
Quantify outcomes and feed back into governance (judge-gated).

## Key build activities
Versioned operational→OMOP mappings; CDM instantiation automation; cohort/outcome jobs; drift detection; policy tuning proposals.

## Risks
Causal ambiguity; mapping drift; version conflicts.

## Oversight checks applied
J1 ethical measurement; J2 mapping/version regression; J3 impact tied to operational levers.

## Judge decisions

### J1: Pass
Measurement and surveillance strengthen governance.

### J2: Conditional Pass
Need mapping versioning + migration/backfill strategy.

**Remediation:** mapping artifact lifecycle + regression tests.

### J3: Conditional Pass
Every metric must map to a controllable decision boundary.

**Remediation:** ban “orphan metrics” with no operational lever.

## Exit criteria
At least two outcome measures computed with provenance to orchestration events.

---
