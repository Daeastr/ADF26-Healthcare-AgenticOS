# Phase 8 — Model serving endpoints + evaluation harness

## Objective
Standardize model endpoints (LLM, classifiers, ranking) and add evaluation, monitoring, and gating.

## Key build activities
- Define model endpoint API contracts and input/output schema.
- Add prompt/version tracking and reproducibility.
- Implement offline eval harness and basic golden sets.
- Add runtime monitoring (drift, error rates, safety flags).

## Risks
- Model changes not traceable to clinical outputs.
- Prompt injection or data exfiltration.
- Evaluation not representative.

## Oversight checks applied
- Security review: endpoint auth, egress, injection mitigations.
- Privacy review: PHI sent to models, retention.
- Governance review: release gates.

## Judge decisions (J1/J2/J3)
- **J1:** Model contract + versioning complete.
- **J2:** Safety filters and injection defenses present.
- **J3:** Evaluation artifacts linked to releases and auditable.

## Exit criteria
- Model endpoint spec published.
- Eval harness running with baseline metrics.
- Release gating documented and enabled.
