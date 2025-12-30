# ClinOps Kernel — Healthcare AgenticOS

ClinOps Kernel is a governance-first “clinical operations kernel” for building and operating healthcare agentic systems.

It is designed to be the missing execution-control layer that makes agentic systems safe and certifiable in real clinical operations.

## Components this repo will host

- **Agents**
  - Bed flow
  - Medication workflow advisor
  - Discharge planning
- **SMART apps** (embedded clinician apps)
- **Model-serving endpoints** (versioned, gated, monitored)

## Exactly 10 Phases Development Plan

Each phase has a dedicated file under `docs/phases/` and includes:
- Objective
- Key build activities
- Risks
- Oversight checks applied
- Judge decisions (3-layer: J1/J2/J3)
- Exit criteria

### Phase index
1. Phase 1 — Kernel Contract & Clinical Action Taxonomy
2. Phase 2 — Identity Fabric Baseline (Keycloak + OS Tokens)
3. Phase 3 — SMART Launch Gateway (client-js mediated)
4. Phase 4 — Interop Data Plane (FHIR Syscalls) + Conformance Gates
5. Phase 5 — Clinical Workflow Host Adapter v1 (OpenMRS Driver)
6. Phase 6 — Governance Kernel v1 (Policy-as-Code + Explainability with PHI Controls)
7. Phase 7 — Clinical CI/CD Kernel (Synthea-first validation + rollout safety)
8. Phase 8 — Production Orchestration Pilot (Bed Flow + Medication Workflow)
9. Phase 9 — Evidence & Impact Plane (OMOP outcome loop)
10. Phase 10 — Health-System Scale & Continuous Certification (multi-hospital)

## What this enables (that the originals cannot do alone)

SMART client-js enables app authorization, Keycloak enables IAM, FHIR server enables data access, OpenMRS enables workflow operations, Synthea enables synthetic testing, OHDSI enables outcomes measurement—but none enforce:

(a) non-bypassable runtime clinical policy decisions,
(b) end-to-end provenance from authorization → action → outcome, and
(c) harm-signal rollback tied to production orchestration, at health-system scale.

ClinOps Kernel is explicitly designed to be that missing execution-control layer.

---
