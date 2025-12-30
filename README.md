# ClinOps Kernel — Healthcare AgenticOS

This repository scaffolds **ClinOps Kernel**, a governance-first “clinical operations kernel” for building and operating healthcare agentic systems.

The kernel is the **minimal, auditable, policy-controlled core** that:

- Defines the canonical **event model** and **contracts** between agents, SMART apps, model endpoints, and humans.
- Applies **policy versioning** and enforcement (scope, permissions, escalation, overrides).
- Produces **tamper-evident audit evidence** for each decision and action.
- Implements safety-by-design controls: threat modeling, oversight checks, and “judge” decisions.

The practical goal: make it straightforward to build clinically useful automation (e.g., bed flow, medication workflow guidance, discharge planning) while keeping **governance, auditability, and risk controls** default-on.

---

## Exactly-10-phase development plan

This repo follows an **exactly 10 phase** delivery plan. Each phase has a markdown file under `docs/phases/` with:

- Objective
- Key build activities
- Risks
- Oversight checks applied
- Judge decisions (J1/J2/J3)
- Exit criteria

### Phases

1. **Phase 1 — Kernel contract + event model + audit baseline**
2. **Phase 2 — Policy engine + versioning + enforcement points**
3. **Phase 3 — Identity, authZ, break-glass, and consent hooks**
4. **Phase 4 — Observability + metrics + incident playbooks**
5. **Phase 5 — Tamper-evident ledger + evidence packaging**
6. **Phase 6 — Agent runtime patterns (tools, memory, safety rails)**
7. **Phase 7 — SMART app integration patterns and UX guardrails**
8. **Phase 8 — Model serving endpoints + evaluation harness**
9. **Phase 9 — Clinical validation workflows + PHI handling hardening**
10. **Phase 10 — Production readiness + governance operations**

See `docs/phases/phase-01.md` … `docs/phases/phase-10.md`.

---

## Repository layout (scaffold)

- `docs/`
  - `kernel/` — kernel contracts, taxonomies, threat model, ledger design
  - `phases/` — the 10-phase plan specs
  - `adr/` — architecture decision records
- `kernel/` — governance kernel implementation (scaffold)
- `agents/` — agent implementations (scaffold)
- `smart-apps/` — SMART on FHIR apps (scaffold)
- `model-serving/` — model endpoints and adapters (scaffold)

---

## Phase 1 deliverables (initial)

Phase 1 focuses on defining the **contracts and canonical shapes** needed before implementing runtime code:

- Kernel contract (`docs/kernel/kernel-contract.md`)
- Clinical action taxonomy (`docs/kernel/clinical-action-taxonomy.md`)
- Audit taxonomy (`docs/kernel/audit-taxonomy.md`)
- Threat model (`docs/kernel/threat-model.md`)
- Tamper-evident ledger concept (`docs/kernel/tamper-evident-ledger.md`)
- ADRs for canonical event model and policy versioning (`docs/adr/`)

---

## Notes / guardrails

This scaffolding is intentionally implementation-light. It is meant to be a **design and governance baseline**.

Nothing in this repository constitutes medical advice. Any deployment must undergo appropriate institutional approvals, security review, and clinical validation.
