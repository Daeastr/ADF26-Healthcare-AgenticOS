# Clinical Action Taxonomy (scaffold)

This taxonomy enumerates *classes* of actions agents/apps may recommend or request. It is used to:

- Assign **risk level**
- Determine required **oversight**
- Determine required **audit evidence**

## Action classes

### A. Information / summarization
- Generate summaries, checklists, reminders
- Risk: low–medium (misleading summaries)
- Oversight: optional; required for high-impact decisions

### B. Workflow guidance
- Suggest next steps in a protocol
- Escalate tasks to appropriate roles
- Risk: medium
- Oversight: typically J1+J2 automated, human review for higher criticality

### C. Orders & chart-impacting recommendations
- Recommend medication changes, lab orders, imaging
- Risk: high
- Oversight: human approval required; J2 strict

### D. Patient movement / bed-flow operations
- Recommend transfer, bed assignment, discharge readiness signals
- Risk: medium–high (operational + patient safety)
- Oversight: human confirmation; clear accountability

### E. External communications
- Draft messages to clinicians/patients; paging suggestions
- Risk: medium (tone, privacy)
- Oversight: review before sending where sensitive

### F. System actions (tool calls)
- Read from EHR APIs, write to operational systems
- Risk: varies; writes are high
- Oversight: policy-gated; writes require stronger audit

## Severity levels (proposed)
- **S0:** non-clinical metadata
- **S1:** informational
- **S2:** operational guidance
- **S3:** clinically consequential (requires human sign-off)
- **S4:** high-risk / prohibited without break-glass

## Oversight mapping (proposed)
- S0–S1: J1 required, J2 optional
- S2: J1 + J2 required
- S3: J1 + J2 + human approval; J3 for evidence completeness
- S4: break-glass workflow + dual approval + post-hoc review

## Notes
This is a scaffold taxonomy. Real deployments must align to local policy, clinical governance, and regulatory constraints.
