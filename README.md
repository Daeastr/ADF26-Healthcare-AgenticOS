# ADF26 Healthcare AgenticOS

## Phase Index

- Phase 0 – Foundations
- Phase 1 – Core OS + Kernel
- **Phase 2 – Identity baseline (Keycloak + OS tokens + break-glass)**
  - Establish a minimal Keycloak realm (`clinops`) and client patterns.
  - Mint short-lived OS-scoped tokens from the Kernel with explicit audience/scopes and purpose-of-use context.
  - Define an emergency "break-glass" workflow with step-up auth, tight scoping, and post-hoc review/audit artifacts.
- Phase 3 – Safety, Governance, and Controls

## Identity (Phase 2)

See:
- `docs/identity/keycloak-realm.md`
- `docs/identity/os-tokens.md`
- `docs/identity/break-glass.md`
- `docs/identity/threats.md`
