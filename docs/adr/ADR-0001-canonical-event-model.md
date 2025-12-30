# ADR-0001: Canonical Event Model

- Status: Accepted (scaffold)
- Date: 2025-12-30

## Context
ClinOps Kernel requires a canonical event model to ensure interoperability, auditability, and consistent policy enforcement across agents, SMART apps, and model-serving endpoints.

We need an event envelope that:
- Can represent proposals, decisions, approvals, tool calls, and outcomes.
- Supports traceability (correlation/causality).
- Minimizes PHI and supports redaction.
- Supports policy version references.

## Decision
Adopt a single **canonical event envelope** for all kernel-governed interactions.

### Required top-level fields (v0)
- `event_id`: UUID/ULID
- `event_type`: namespaced string (e.g., `kernel.decision.recommendation`)
- `occurred_at`: RFC3339 UTC timestamp
- `actor`: `{ actor_type, actor_id, role, org_unit? }`
- `subject`: `{ subject_type, subject_id_token?, patient_mrn_token?, encounter_id_token? }`
- `context`: `{ workflow, location?, system_of_record? }`
- `correlation`: `{ trace_id, parent_event_id?, causality?: [event_id...] }`
- `policy`: `{ policy_id, policy_version, decision, constraints_applied? }`
- `oversight`: `{ j1, j2, j3, reviewers?, break_glass? }`
- `payload_ref`: `{ schema, version, content_hash, uri? }`
- `audit`: `{ evidence_bundle_id?, ledger_ref? }`

### Canonical payloads
The envelope references payloads via `payload_ref` rather than embedding PHI.
Payload schemas are versioned and stored in controlled locations.

## Consequences
- All components must emit/consume this envelope.
- Requires canonical serialization rules for hashing/ledger.
- Requires schema registry or versioning discipline.

## Alternatives considered
- Multiple event types per subsystem (rejected: poor interoperability).
- Direct FHIR AuditEvent only (rejected: insufficient for agent/tool workflow semantics; may be mapped later).
