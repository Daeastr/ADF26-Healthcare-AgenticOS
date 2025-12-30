# Phase 3 — SMART Launch Gateway (Scaffold)

This phase introduces a **SMART Launch Gateway** that sits between SMART-on-FHIR clients (apps) and AgenticOS.

The goal is to:

1. enforce **secure SMART/OAuth invariants** (PKCE, redirect URI allowlist, state/nonce binding), and
2. translate SMART scopes and consent context into **AgenticOS OS-scoped tokens** with **purpose binding** and auditability.

> Status: scaffold/skeleton. Upstream EHR/IdP integration and full token exchange are not implemented yet.

---

## Why a gateway?

SMART launches are often initiated from an EHR context with user/patient/encounter bindings. AgenticOS additionally needs:

- a consistent boundary where **redirect safety** and **anti-CSRF** checks are enforced,
- a place to map SMART scopes into OS capabilities,
- a way to produce **purpose-bound** and **time-bounded** tokens with auditable issuance.

---

## Security invariants enforced (Phase 3 scaffold)

The scaffold in `smart-launch-gateway/` enforces:

- **Mandatory PKCE** with `code_challenge_method=S256`
- **Strict redirect URI allowlist**
  - exact match only
  - `https://` required (except `localhost` for dev)
- **State binding**
  - the `state` received at callback must match the stored transaction state
- **Nonce binding**
  - stored for OIDC verification (full ID Token validation comes in a later phase)

Files to review:

- `src/security/pkce.ts`
- `src/security/redirectAllowlist.ts`
- `src/security/csrf.ts`

---

## Consent and scope mapping

SMART apps request scopes like:

- `openid fhirUser profile`
- `launch` / `launch/patient`
- `patient/*.read`, `user/*.read`
- `offline_access`

In AgenticOS we treat SMART scopes as an **input signal**, but we mint **OS-scoped tokens** that encode:

- **actor**: the authenticated end-user (and optionally the app client)
- **subject context**: patient / encounter (when available)
- **capabilities**: derived from SMART scopes (least privilege)
- **purpose of use**: treatment, payment, operations, research, etc.

### Suggested mapping approach

1. Parse SMART scopes into normalized permissions (resource types + actions).
2. Optional policy filtering:
   - tenant policy
   - app registration policy
   - user role policy
3. Create an AgenticOS capability set, e.g.

| SMART scope | Normalized permission | AgenticOS capability (example) |
|---|---|---|
| `patient/Observation.read` | Observation:read (patient) | `fhir.read:Observation:patient` |
| `user/MedicationRequest.read` | MedicationRequest:read (user) | `fhir.read:MedicationRequest:user` |
| `patient/*.read` | *:read (patient) | `fhir.read:*:patient` |

4. Bind those capabilities to a **purpose** (see below).

### Purpose binding

The minted OS token must include (or be derivable to) a `purpose_of_use` claim such as:

- `treatment`
- `payment`
- `operations`
- `research`

Where does purpose come from?

- explicit user consent UI choice
- app registration metadata (default purpose)
- EHR launch context (if present)
- organizational policy

In this scaffold, the gateway posts `purpose: "treatment"` to the kernel token endpoint as a placeholder.

---

## Audit records (purpose-bound issuance)

Every token issuance should produce an audit record that supports future verification and incident response.

### Minimal audit record fields

- `event_type`: `token_issued`
- `timestamp`
- `client_id`
- `user_id` (or subject)
- `patient_id` / `encounter_id` (if applicable)
- `requested_scopes`
- `granted_capabilities`
- `purpose_of_use`
- `redirect_uri`
- `pkce_method`: must be `S256`
- `decision`: granted/denied + reason
- `correlation_id` / `state`

### Purpose binding verification

Downstream services should be able to validate that:

1. a given OS token is bound to `purpose_of_use`, and
2. access logs can be correlated back to the issuance record for that purpose.

---

## Kernel token minting (placeholder)

The gateway calls a placeholder kernel endpoint:

- `POST $KERNEL_TOKEN_ENDPOINT`

With a body resembling:

```json
{
  "grant_type": "smart_authorization_code",
  "code": "...",
  "client_id": "...",
  "scope": "patient/*.read openid fhirUser",
  "aud": "...",
  "launch": "...",
  "purpose": "treatment"
}
```

The kernel is expected to return something like:

```json
{
  "access_token": "...",
  "token_type": "Bearer",
  "expires_in": 900
}
```

---

## Running the scaffold

```bash
cd smart-launch-gateway
cp .env.example .env
npm install
npm run dev
```

Required environment variables:

- `GATEWAY_BASE_URL` (e.g., `https://gateway.example.org`)
- `REDIRECT_ALLOWLIST` (comma-separated exact redirect URIs)
- `COOKIE_SECRET`
- `KERNEL_TOKEN_ENDPOINT`

---

## Next steps

- Add upstream authorization server integration (EHR/IdP)
- Redeem authorization code properly and validate `id_token` nonce
- Replace in-memory pending auth store with durable store
- Add signed/encrypted cookies for transaction binding
- Add structured audit emission to the kernel/audit service
- Add robust scope parsing and policy evaluation
