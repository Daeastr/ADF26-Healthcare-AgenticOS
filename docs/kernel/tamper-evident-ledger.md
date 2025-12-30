# Tamper-evident Ledger (scaffold)

## Goal
Provide integrity guarantees for critical events and audit evidence so retrospective review can detect tampering.

## Design sketch
- Each audited record is represented as a canonical byte serialization of the event/audit envelope.
- Compute `record_hash = H(canonical_bytes)`.
- Maintain an append-only chain:
  - `chain_hash_n = H(chain_hash_{n-1} || record_hash_n || metadata)`
- Optionally sign `chain_hash_n` with a rotating signing key.

## Anchoring (optional)
- Periodically anchor a checkpoint hash to an external system (e.g., separate append-only store, transparency service, or other immutable medium).

## Verification
To verify integrity:
1. Recompute record hashes from stored canonical bytes.
2. Recompute chain hashes and compare to stored checkpoints.
3. Verify signatures and key lineage.

## Privacy considerations
- Never store raw PHI in the ledger if avoidable.
- Store pointers (secure locations) + hashes; keep PHI in access-controlled stores.

## Open items
- Concrete canonical serialization (ties to ADR-0001).
- Key management: HSM/KMS, rotation cadence, compromise handling.
- Evidence bundle export format.
