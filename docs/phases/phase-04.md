# Phase 4 — Observability + metrics + incident playbooks

## Objective
Add measurements and operational readiness basics: logs/metrics/traces, safety metrics, and incident response playbooks.

## Key build activities
- Define key metrics (decision latency, override rates, escalation rates).
- Implement structured logging aligned with audit taxonomy.
- Add trace correlation via event IDs.
- Draft incident runbooks: PHI leak, unsafe recommendation, outage.

## Risks
- Over-collection of data (privacy risk).
- Under-collection reduces incident response capability.
- Metrics misinterpreted as clinical performance.

## Oversight checks applied
- Privacy review: telemetry minimization.
- Security review: log integrity, access controls.
- Governance review: incident escalation rules.

## Judge decisions (J1/J2/J3)
- **J1:** Observability fields aligned to event model.
- **J2:** Safety metrics meaningful and actionable.
- **J3:** Incidents produce auditable evidence bundles.

## Exit criteria
- Metrics and logging spec finalized.
- Correlation IDs consistently implemented.
- Incident playbooks written and reviewed.
