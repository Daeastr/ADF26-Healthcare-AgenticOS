# Minimal Keycloak realm baseline (Phase 2)

This document defines a minimal, deployable Keycloak baseline for **Phase 2** identity in AgenticOS.

> Goal: establish a consistent realm, clients, roles/groups, and token-claim conventions so the OS Kernel can enforce ABAC (including **purpose-of-use**) while gateway/services rely on standard OIDC.

## Scope and non-goals

**In scope**
- A single realm for clinical operations identity.
- OIDC issuer placeholder and discovery expectations.
- Minimal client set to cover:
  - user-facing confidential client (OS gateway)
  - SMART-on-FHIR style public client with PKCE (launch)
  - service-to-service confidential client(s)
- Roles/groups mapping conventions.
- Token claim requirements for ABAC (purpose-of-use handled by the Kernel).

**Non-goals**
- Full HA Keycloak deployment, multi-realm tenancy, or external IdP federation details.
- Fine-grained Keycloak authorization services policies (ABAC is enforced in the Kernel).

---

## Realm

- **Realm name:** `clinops`
- **Issuer (placeholder):** `https://<keycloak-host>/realms/clinops`
- **OIDC discovery URL:** `https://<keycloak-host>/realms/clinops/.well-known/openid-configuration`

### Token settings (recommended defaults)
- Access token lifespan: 5–15 minutes (prefer shorter)
- Refresh token: enabled for confidential clients; consider disable for public clients depending on UX
- SSO session: per environment policy (e.g., 8–12h)

---

## Clients

### 1) `os-gateway` (confidential)

**Purpose**: Primary user-facing entry point (API gateway / UI backend) that exchanges authorization codes and calls downstream OS APIs.

**Client type**: Confidential

**Flows**:
- Standard Authorization Code Flow
- PKCE: recommended even for confidential clients
- Direct Access Grants (password): **disabled**

**Redirect URIs**:
- `https://<gateway-host>/oidc/callback`
- `http://localhost:<port>/oidc/callback` (dev only)

**Web origins**:
- `https://<gateway-host>`

**Client auth**:
- Client secret rotated regularly
- Prefer mTLS or private_key_jwt if available

**Token expectations**:
- `aud` includes `os-gateway` and OS APIs as required (see OS token guidance)
- `azp` = `os-gateway`

---

### 2) `smart-launch` (public, PKCE)

**Purpose**: SMART-on-FHIR style launch client for user-initiated flows (EHR launch or standalone app launch). This is a public client.

**Client type**: Public

**Flows**:
- Authorization Code Flow **with PKCE required**
- Implicit flow: **disabled**

**PKCE**:
- Required; `S256` only

**Redirect URIs**:
- `https://<app-host>/smart/callback`
- `http://localhost:<port>/smart/callback` (dev only)

**Token expectations**:
- Tokens are bound to a user session and used to request OS-scoped tokens when needed.

---

### 3) `svc-*` (service-to-service, confidential)

**Purpose**: Internal service identity for machine-to-machine calls (e.g., `svc-kernel`, `svc-audit-writer`, `svc-data-proxy`).

**Client type**: Confidential

**Flows**:
- Client Credentials Flow

**Client auth**:
- Prefer private_key_jwt or mTLS. If client secret is used, store in a secrets manager.

**Token expectations**:
- No user context; tokens represent service identity only.
- `sub` should be stable per service.

---

## Roles, groups, and mapping conventions

### Realm roles (minimal baseline)
Define a small set of realm roles to represent coarse permissions:

- `clinician`
- `nurse`
- `pharmacist`
- `care-coordinator`
- `admin`
- `auditor`

Service accounts may additionally carry:
- `svc`
- `svc:kernel`
- `svc:audit-writer`

> Keep roles **coarse**. Fine-grained authorization (resource-level decisions, consent, purpose-of-use) is enforced by the OS Kernel.

### Groups
Use groups to model organizational context and to attach role mappings.

Recommended group naming:
- `/org/<facility-or-tenant>`
- `/org/<facility-or-tenant>/dept/<department>`
- `/org/<facility-or-tenant>/team/<team>`

Example:
- `/org/clinops-hospital-a/dept/ed`
- `/org/clinops-hospital-a/dept/oncology`

### Mapping users to roles/groups
- Assign users to one or more `/org/...` groups.
- Attach realm role mappings to groups (preferred) rather than directly to users.
- Keep group membership changes auditable.

---

## Required token claims

The OS relies on **standard OIDC/JWT validation** and a small set of required claims.

### Required (access token)
- `iss`: must match the realm issuer
- `sub`: stable subject identifier
- `aud`: includes intended OS audience (see `docs/identity/os-tokens.md`)
- `exp`, `iat`, `nbf` (if used)
- `jti`: required to support replay detection and audit correlation

### User context (when applicable)
- `preferred_username` or `email` (for operator UX + audit)
- `realm_access.roles` (or equivalent) for coarse roles
- `groups` (optional but recommended) for org context

### Purpose-of-use ABAC (handled by Kernel)
Purpose-of-use (PoU) is **not** enforced by Keycloak.

Keycloak should:
- allow requesting a `purpose` (or similar) scope/claim
- optionally include a **requested** purpose-of-use claim

The Kernel should:
- validate PoU semantics and policy
- apply ABAC decisions based on PoU + patient context + consent + break-glass state

#### Claim convention (recommended)
Include one of the following in the **OS-scoped token** (preferred) or upstream token:

- `pou`: string code (e.g., `TREATMENT`, `PAYMENT`, `OPERATIONS`, `EMERGENCY`)
- `pou_reason`: free-text justification (required for emergency / break-glass)

> In Phase 2, treat `pou` as a *request*; the Kernel may mint a downstream OS token reflecting the approved/normalized PoU.

---

## JWKS and key rotation

- Expose JWKS via the OIDC discovery endpoints.
- Rotate signing keys on a schedule and on incident response.
- Keep at least one prior key available to validate in-flight tokens.

---

## Environment notes

- Dev/test may run a single Keycloak instance.
- Prod should plan for HA and disaster recovery; see `docs/identity/threats.md` for outage dependency mitigations.
