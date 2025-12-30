# Break-glass (emergency access) workflow (Phase 2)

This document defines the emergency access ("break-glass") workflow for AgenticOS Phase 2, including post-hoc review and required audit artifacts.

> Objective: enable time-bounded, justified access when normal authorization would deny, while ensuring strong accountability and review.

## Definition

**Break-glass** is an emergency override that allows access to otherwise restricted patient data/actions under controlled conditions.

Break-glass is **not** a blanket allow-all. It is:
- explicitly requested
- explicitly justified
- time-bounded
- tightly scoped (patient/resource/action)
- thoroughly audited and reviewed

---

## When break-glass is allowed

Allowed scenarios (examples):
- life-threatening emergency requiring immediate access to patient data
- patient is incapacitated and consent cannot be obtained in time

Not allowed (examples):
- convenience access ("faster workflow")
- routine care when normal policy would allow with correct context
- internal curiosity / non-clinical reasons

The Kernel remains the final policy decision point.

---

## Actors and responsibilities

- **Requestor (clinician/operator):** initiates break-glass with justification and acknowledges policy.
- **Kernel:** enforces break-glass policy, mints/annotates OS-scoped tokens, writes auditable events.
- **Approver (optional, policy-dependent):** in some environments, break-glass requires secondary approval.
- **Auditor/Compliance:** performs post-hoc review and adjudication.

---

## Workflow (recommended)

1) **Normal access attempt**
- User attempts an action.
- Kernel evaluates ABAC and denies with reason codes.

2) **Break-glass request initiation**
- Client prompts user with:
  - patient identifier/context
  - requested purpose-of-use = `EMERGENCY`
  - required justification text (free form)
  - acknowledgement checkbox (policy notice)

3) **Step-up authentication (required)**
- Trigger step-up auth (e.g., WebAuthn, OTP, or re-auth) before granting break-glass.
- The step-up event must be recorded and bound to the issued emergency token.

4) **Kernel policy evaluation and scoping**
- Kernel checks:
  - user role eligibility (e.g., clinician)
  - active employment/assignment if available
  - rate limits / anomaly signals
  - patient scoping constraints (single patient or narrow cohort)
  - duration (short TTL)

5) **Emergency OS token issuance**
- Kernel mints an **OS-scoped token** with:
  - `pou=EMERGENCY`
  - `break_glass=true`
  - `break_glass_id` (unique identifier)
  - `break_glass_justification` (or reference to stored justification)
  - restricted `aud` and `scope`
  - short `exp` (e.g., 5–10 minutes)

6) **Access and continuous auditing**
- All accesses performed with break-glass must:
  - include `break_glass_id`
  - emit audit events for reads and writes
  - be attributable to user + client + device/session

7) **Automatic expiry and re-authorization**
- Emergency tokens expire quickly.
- Re-issuance requires re-confirmation and possibly repeated step-up.

---

## Post-hoc review requirements

Break-glass usage must be reviewed in a defined window.

### Minimum review SLAs
- **Initial review**: within 24–72 hours
- **Final adjudication**: within 7–14 days (policy dependent)

### Review checklist (minimum)
- Was there an appropriate emergency reason?
- Was the accessed patient scope correct?
- Was access limited to what was needed?
- Were alternative lawful access paths available?
- Any unusual patterns (time, volume, repeated use)?

### Outcomes
- **Approved**: no further action
- **Needs follow-up**: training/workflow correction
- **Violation**: compliance/security incident handling

---

## Required audit artifacts

At minimum, each break-glass session must produce:

1) **Break-glass request record**
- `break_glass_id`
- user identity (`sub`, username)
- client (`azp`), device/session identifiers
- time requested
- patient/resource scope requested
- justification text (or immutable reference)
- step-up method and timestamp

2) **Token issuance record**
- token identifiers (`jti`), `iat`, `exp`
- scopes/audience issued
- PoU set (`EMERGENCY`)

3) **Access events** (read/write)
- per request: time, endpoint, patient/resource identifiers, decision outcome
- correlation IDs linking to `break_glass_id` and `jti`

4) **Reviewer decision record**
- reviewer identity
- decision outcome + comments
- timestamps

5) **Tamper-evident storage**
- audit logs must be immutable/tamper-evident by design (WORM, append-only, or signed log chains).

---

## Security and privacy notes

- Justification text may contain sensitive info; store with least privilege and retention rules.
- Limit emergency access to the minimum scope and shortest duration.
- Monitor and alert on break-glass frequency spikes.

---

## Implementation notes

- See `docs/identity/os-tokens.md` for OS token minting.
- See `docs/identity/threats.md` for threat model and mitigations.
