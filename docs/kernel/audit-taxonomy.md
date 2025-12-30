# Audit Taxonomy (scaffold)

Defines audit event categories and required evidence. Used by ClinOps Kernel to ensure decisions/actions are reconstructable.

## Core audit categories

### 1) Decision provenance
- Inputs (redacted pointers + hashes)
- Model/agent version identifiers
- Prompt/templates (if applicable) with version
- Rationale/justification (structured + free text)

### 2) Policy enforcement
- Policy ID + version
- Evaluation result (allow/deny/require-approval)
- Constraints applied (scopes, time windows)

### 3) Oversight & approvals
- Judge gate outcomes (J1/J2/J3)
- Human reviewer identity and role
- Attestation text / reason codes

### 4) Data access
- What data was accessed (category, not raw PHI)
- Purpose of use
- Consent/break-glass references

### 5) External side effects
- Tool calls (endpoint, method class, parameters hashed)
- Write acknowledgements / EHR transaction IDs
- Failure modes and retries

### 6) Evidence integrity
- Hash-chain/ledger pointers
- Signatures (who/what signed)
- Export bundle IDs

## Minimum required fields (baseline)
- `event_id`, `event_type`, `occurred_at`
- `actor` (id + role)
- `policy_ref` (id + version)
- `oversight_ref` (if any)
- `evidence_refs` (hashes + locations)

## Retention and access (placeholder)
- Retention policies must be defined per institution.
- Access to audit evidence must be least-privilege and logged.
