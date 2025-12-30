# Threat Model (scaffold)

## Scope
Threats to ClinOps Kernel and connected components (agents, SMART apps, model endpoints), with emphasis on:

- PHI confidentiality integrity and availability
- Safety risks from incorrect/unsafe recommendations
- Integrity of audit evidence

## Assets
- Patient identifiers and clinical context (PHI)
- Policy definitions and history
- Audit evidence bundles
- Credentials / tokens
- Model prompts/templates and outputs

## Actors / adversaries
- External attacker (network)
- Malicious insider
- Negligent user
- Compromised agent runtime
- Compromised model endpoint / supply chain

## Top threats and mitigations (initial)

### T1: Prompt injection / tool injection leading to unsafe actions
- Mitigations: strict tool mediation via kernel; allowlists; argument validation; J2 gating for high-risk actions.

### T2: PHI exfiltration via logs/telemetry
- Mitigations: redaction-by-default; structured logging with PHI categories; access controls; data loss prevention checks.

### T3: Policy bypass by direct API calls
- Mitigations: enforce writes through kernel EPs; network ACLs; signed requests; service-to-service auth.

### T4: Audit log tampering
- Mitigations: tamper-evident ledger; signatures; append-only storage; periodic anchoring.

### T5: Unauthorized data access via over-broad SMART scopes
- Mitigations: least-privilege scopes; consent checks; launch-context minimization; continuous review.

### T6: Model drift / untracked model changes
- Mitigations: model version pinning; evaluation gates; monitoring; rollback.

### T7: Break-glass misuse
- Mitigations: friction + justification; dual approval; post-hoc review; anomaly detection.

## Open items
- Formal STRIDE or similar enumeration.
- Quantitative risk ranking.
- Concrete controls mapping to compliance frameworks.
