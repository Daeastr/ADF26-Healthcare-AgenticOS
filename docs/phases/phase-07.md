# Phase 7 — Clinical CI/CD Kernel (Synthea-first validation + rollout safety)

## Objective
Clinically validated deployment with rollback on harm signals.

## Key build activities
Artifact typing; Synthea scenario packs in CI; conformance + safety tests; canary deployments; harm rollback triggers; release attestation.

## Risks
Synthetic-only blind spots; wrong harm thresholds; rollback instability.

## Oversight checks applied
J1 evidence retention; J2 reproducible builds + SBOM; J3 ensure CI/CD serves kernel mission.

## Judge decisions

### J1: Conditional Pass
Validation evidence must be auditable and retained.

**Remediation:** evidence retention + access controls.

### J2: Conditional Pass
Require SBOM + provenance attestations + reproducible env.

**Remediation:** supply chain controls and deterministic pipelines.

### J3: Pass
Safety CI/CD is core differentiator.

## Exit criteria
Pipeline gates enforced; Synthea scenarios run; canary+rollback proven in staging.

---
