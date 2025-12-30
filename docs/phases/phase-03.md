# Phase 3 — SMART Launch Gateway (client-js mediated)

## Objective
Support embedded SMART apps while ensuring OS mediation.

## Key build activities
Implement SMART launch endpoints that issue OS-scoped tokens; integrate client-js patterns (authorize/ready/init); enforce “apps talk to OS first”.

## Risks
Breaking SMART compatibility; redirect/session vulnerabilities.

## Oversight checks applied
J1 consent/minimum necessary; J2 OAuth security; J3 prevent direct-to-FHIR bypass.

## Judge decisions

### J1: Conditional Pass
Consent & scope mapping must be explicit and auditable.

**Remediation:** add consent/purpose binding records in audit chain.

### J2: Conditional Pass
Require hardened redirect URI validation + PKCE + CSRF defenses.

**Remediation:** implement mandatory PKCE and strict redirect allowlists.

### J3: Pass
Establishes controlled app ecosystem without losing SMART adoption.

## Exit criteria
SMART apps can launch and obtain OS-mediated client; bypass controls enforced.

---
