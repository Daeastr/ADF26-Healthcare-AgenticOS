# ClinOps Kernel — Kernel Contract (v0 scaffold)

## Purpose
ClinOps Kernel is the governance and control plane for healthcare agentic systems. It defines the **contract** that all agents, apps, and model endpoints must follow to ensure:

- **Safety** (bounded autonomy, escalation, oversight)
- **Policy enforcement** (who/what can do what, under which constraints)
- **Auditability** (reconstructable decision trails)
- **Privacy & security** (PHI minimization, access controls)

## In scope (kernel responsibilities)
- Canonical **event ingestion/egress**: normalize action requests, decisions, and outcomes.
- **Policy evaluation** and enforcement gates.
- **Oversight workflow** orchestration (human approvals, "judge" checks).
- **Audit evidence** capture and packaging.
- **Tamper-evident** logging/ledger for critical events.

## Out of scope
- EHR-specific business logic and UI (lives in SMART apps / integrations).
- Agent reasoning strategies (lives in `agents/`), except for enforced constraints.
- Model training (lives outside; kernel tracks versions/usage).

## Contract invariants
These must hold for any compliant component:

1. **All external actions are represented as events** in the canonical event model.
2. **All decisions reference a policy version** that was evaluated.
3. **High-risk actions require oversight** per taxonomy + policy.
4. **Evidence must be sufficient to reconstruct**: who/what decided, inputs (redacted as needed), rationale, and resulting action.
5. **No component may bypass kernel enforcement points** for protected actions.

## Enforcement points
- **EP1: Action proposal** (agent/app proposes a clinical/operational action)
- **EP2: Tool invocation** (agent calls an external system)
- **EP3: State mutation** (writes/updates to shared operational state)
- **EP4: Disclosure** (rendering or exporting PHI/evidence)

## Canonical event envelope (high-level)
All events should support at minimum:

- `event_id` (globally unique)
- `event_type` (from taxonomy)
- `occurred_at` (UTC)
- `actor` (human/service/agent identity)
- `subject` (patient/case identifiers; may be tokenized)
- `context` (encounter/unit/workflow)
- `inputs` (redacted references)
- `decision` (if applicable: recommendation + confidence/uncertainty)
- `policy` (policy id + version + evaluation result)
- `oversight` (approvals, judge gates, break-glass)
- `audit` (evidence pointers)

Canonical details are defined in ADR-0001.

## Oversight and judges (J1/J2/J3)
Kernel supports three decision gates:

- **J1 (Coherence):** Is the request well-formed and within allowed workflow context?
- **J2 (Safety):** Does this require human oversight / escalation? Are contraindications present?
- **J3 (Auditability):** Is the evidence bundle complete and exportable?

Judges can be automated checks, human approvals, or a combination.

## Evidence bundle (baseline)
For actions that affect clinical operations:

- Event envelope + immutable IDs
- Policy evaluation outcome + policy version
- Inputs/outputs hashes (with redacted storage pointers)
- Human approvals/attestations (if any)
- External system acknowledgements

## Versioning
- Contract versions are semver-ish (`vMAJOR.MINOR`).
- Event model changes require ADR updates and migration guidance.

## Open items (to be resolved in later phases)
- Concrete policy language/spec and evaluation engine.
- Identity integration and consent representation.
- Ledger anchoring strategy.
