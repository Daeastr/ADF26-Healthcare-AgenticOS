# Phase 2 — Identity Fabric Baseline (Keycloak + OS Tokens)

## Objective
Establish enterprise IAM with step-up auth and service identities.

## Key build activities
Keycloak OIDC realm; service-to-service identity; baseline RBAC; token minting for OS Gateway; emergency access concept draft.

## Risks
Over-centralization; outage dependency; mis-scoped tokens.

## Oversight checks applied
J1 policy mapping; J2 secure token handling; J3 avoid “IAM project” detour.

## Judge decisions

### J1: Conditional Pass
Need break-glass + post-hoc review requirements.

**Remediation:** define emergency access workflow + audit artifacts.

### J2: Pass
Identity baseline is standardizable and testable.

### J3: Conditional Pass
Keep IAM minimal; don’t rebuild authorization logic that belongs in kernel.

**Remediation:** document split: Keycloak=authn, kernel=purpose-of-use ABAC.

## Exit criteria
Keycloak integrated; OS can authenticate users/services; break-glass draft approved (no fails).

---
