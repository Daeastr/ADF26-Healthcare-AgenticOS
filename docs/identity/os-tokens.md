# OS-scoped tokens (Phase 2)

This document specifies **OS-scoped token minting** for AgenticOS Phase 2.

> Objective: separate upstream identity (Keycloak OIDC tokens) from downstream, tightly-scoped tokens used to access kernel-managed capabilities.

## Overview

### Token types
- **Upstream token**: OIDC access token issued by Keycloak for a client (user-facing or service).
- **OS-scoped token**: short-lived token minted by the OS Kernel (or a dedicated Token Service owned by the Kernel) that encodes OS-specific audience, scopes, and ABAC context.

The upstream token is used to authenticate to the Kernel; the OS token is used to call OS internal APIs/capabilities.

---

## Minting flow

1) Client obtains an upstream token from Keycloak.
2) Client calls Kernel token endpoint (example):
   - `POST /v1/tokens/os`
3) Kernel validates upstream token:
   - signature via issuer JWKS
   - `iss`, `aud`, `exp`, `nbf` (if present)
   - `jti` presence
   - role/group claims as needed
4) Kernel evaluates policy and mints an OS-scoped token with:
   - restricted `aud`
   - minimal `scope`
   - optional step-up requirements
   - PoU normalization and break-glass flags

---

## Audience and scopes

### Audience (`aud`)
OS tokens must be minted with explicit audience. Recommended audiences:
- `os-kernel`
- `os-capabilities`
- `os-data-proxy`
- `os-audit`

Rules:
- Do not mint wildcard audience.
- Prefer one primary audience per token; add secondary audiences only when needed.

### Scopes (`scope`)
Scopes should be action-oriented and environment-agnostic.

Recommended minimal scope namespaces:
- `os:capability:invoke` (invoke a registered capability/tool)
- `os:data:read` / `os:data:write`
- `os:patient:context` (set/claim patient context for a session)
- `os:audit:write`

> ABAC still applies even when scopes allow an operation.

---

## Purpose-of-use and ABAC context

### Purpose-of-use (PoU)
- Clients may request PoU via an input field and/or requested claim.
- Kernel decides final PoU for the OS token.

Recommended OS token claims:
- `pou`: one of `TREATMENT | PAYMENT | OPERATIONS | EMERGENCY`
- `pou_reason`: required when `pou=EMERGENCY`

### Patient/resource scoping
OS tokens should include **context constraints**, e.g.:
- `patient_id` (single patient)
- `encounter_id` (optional)
- `resource_types` allowed (optional)

Keep surface minimal; prefer referencing a Kernel-stored authorization context by ID:
- `ctx_id`: opaque reference to server-side context

---

## Step-up authentication

Step-up is required for higher-risk operations, including:
- break-glass requests
- sensitive writes (orders, prescriptions)
- bulk export
- administrative changes

### Signals and claims
The Kernel should record and (optionally) encode in OS tokens:
- `amr`: authentication methods used (e.g., `webauthn`, `otp`)
- `acr`: assurance level
- `auth_time`: time of last authentication/step-up

Policy example:
- require `acr >= 2` and `auth_time` within last 5 minutes for break-glass.

---

## Token format and lifetimes

- Format: JWT (JWS) signed by the Kernel (or token service) with a dedicated key
- Lifetime: typically 2–10 minutes
- Include:
  - `iss`: OS token issuer (e.g., `https://<os-host>/tokens`)
  - `sub`: user or service subject
  - `aud`: OS audience
  - `iat`, `exp`
  - `jti`: unique id
  - `azp`: authorized party (upstream client)
  - `scope`: space-delimited scopes

Optional:
- `cnf` for proof-of-possession (DPoP or mTLS) when supported

---

## Secure handling guidance

### Storage
- Do not store OS tokens in localStorage.
- Prefer in-memory storage; if browser-based, use HttpOnly secure cookies for session binding where feasible.

### Transmission
- Always use TLS.
- Do not log tokens.
- Consider DPoP or mTLS for high-risk endpoints.

### Rotation and revocation
- Use short TTL rather than heavy revocation.
- For emergency and high-risk tokens, maintain a server-side denylist keyed by `jti`.

### Least privilege
- Mint OS tokens with the minimum scopes and narrowest audience.
- Bind OS tokens to:
  - a single patient/context (`ctx_id`)
  - a single use-case (PoU)
  - a single client (`azp`)

---

## Service-to-service usage

- Services should request OS tokens using client-credentials upstream identity.
- Services must use distinct client identities (`svc-*`) and not share credentials.
- Prefer workload identity and mTLS between services.

---

## Audit correlation

The Kernel must emit audit events that include:
- upstream token `jti` (when present)
- OS token `jti`
- request correlation id
- decision outcome (allow/deny) with reason codes

See `docs/identity/break-glass.md` for emergency review artifacts.
