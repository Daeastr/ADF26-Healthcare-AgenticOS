# Identity threats and mitigations (Phase 2)

This document captures identity-specific threats for Phase 2 and recommended mitigations.

## Threat: Token leakage

**Description**: Access/refresh/OS tokens leak via logs, client storage, referers, or crash dumps.

**Impact**: Unauthorized access until expiry; can enable lateral movement.

**Mitigations**
- Never log tokens; redact `Authorization` headers at ingress.
- Prefer short-lived OS-scoped tokens (2–10 min) and short upstream access tokens.
- Avoid browser localStorage for tokens; prefer HttpOnly secure cookies or in-memory.
- Use secrets manager for client secrets; rotate regularly.
- Consider proof-of-possession (DPoP/mTLS) so stolen tokens are less useful.
- Add token fingerprinting and anomaly detection (geo/time/IP/device).

---

## Threat: Token replay

**Description**: A captured token is reused within its validity window.

**Impact**: Unauthorized repeated access; difficult to distinguish from legitimate usage.

**Mitigations**
- Require `jti` in upstream and OS tokens.
- Maintain replay detection for high-risk flows (break-glass, admin) using `jti` and short TTL caches.
- Use DPoP or mTLS binding where possible.
- Include request correlation ids and audit trails.

---

## Threat: Mis-scoping / over-broad audience

**Description**: Tokens minted with overly broad `aud` or `scope` are accepted by more services than intended.

**Impact**: Privilege escalation across OS components; excess data exposure.

**Mitigations**
- Enforce strict audience validation on every service.
- Mint OS tokens with explicit, minimal `aud`.
- Keep scopes coarse but minimal; enforce ABAC in Kernel.
- Do not use wildcard audiences.
- Implement separate audiences per internal service (`os-kernel`, `os-data-proxy`, etc.).

---

## Threat: Confused deputy (client impersonation)

**Description**: A downstream service accepts a token intended for a different client or context.

**Impact**: Unauthorized action under a more privileged client identity.

**Mitigations**
- Validate `azp` and `aud`.
- Use distinct client IDs for gateway vs services.
- Avoid shared service accounts; enforce least privilege.
- Prefer private_key_jwt or mTLS for service clients.

---

## Threat: Purpose-of-use spoofing

**Description**: A client claims a benign purpose-of-use while performing an action inconsistent with policy.

**Impact**: Policy bypass if PoU is trusted blindly.

**Mitigations**
- Treat PoU in upstream tokens as *requested* only.
- Kernel normalizes/approves PoU during OS token minting.
- Require justification and step-up for `EMERGENCY`.
- Audit PoU and enforce post-hoc review for break-glass.

---

## Threat: Identity provider outage dependency

**Description**: Keycloak downtime prevents authentication or token refresh, impacting clinical operations.

**Impact**: Loss of access, delays, safety risk.

**Mitigations**
- Deploy Keycloak in HA with monitored SLOs.
- Use short-lived OS tokens but allow minting based on still-valid upstream tokens if IdP is briefly unavailable.
- Consider limited "grace" modes only for already-authenticated sessions and only for low-risk operations.
- Cache JWKS and discovery data with sane TTLs.
- Document and test DR failover procedures.

---

## Threat: Privileged role assignment errors

**Description**: Users accidentally placed in high-privilege roles/groups.

**Impact**: Overbroad access across patient data.

**Mitigations**
- Use group-based role mappings with change control.
- Require dual-approval for admin role assignment.
- Periodic access reviews.
- Alerting on role/group changes.

---

## Threat: Weak step-up or bypass

**Description**: Step-up auth is not enforced, or can be bypassed via alternative endpoints.

**Impact**: Elevated actions performed without appropriate assurance.

**Mitigations**
- Centralize step-up checks in Kernel policy.
- Require `acr`/`amr` for specific operations.
- Ensure all privileged endpoints require OS-scoped tokens minted post step-up.
- Test negative paths (attempts without step-up).

---

## Threat: Key material compromise

**Description**: Signing keys (Keycloak or OS token signer) are leaked.

**Impact**: Token forgery; total compromise of trust.

**Mitigations**
- Use HSM/KMS-backed keys where possible.
- Strict key rotation and incident playbooks.
- Separate keys per environment.
- Monitor for suspicious JWKS changes.

---

## Threat: Audit gaps

**Description**: Missing or incomplete audit events prevent investigation and compliance.

**Impact**: Undetected misuse; compliance failure.

**Mitigations**
- Make audit emission non-optional for sensitive operations.
- Use tamper-evident audit storage.
- Include correlation identifiers (`jti`, `break_glass_id`, request ids).
- Periodic audit integrity checks.
