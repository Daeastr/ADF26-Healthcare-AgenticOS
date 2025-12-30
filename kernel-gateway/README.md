# kernel-gateway

Development gateway for kernel services.

## Token mint stub (dev)

`POST /auth/mint`

This endpoint is a **development stub** that mints a short-lived JWT.

### Required JSON fields

- `sub` (string) – subject / user identifier
- `aud` (string) – audience
- `trace_id` (string) – required correlation identifier for the request/trace
- `parent_event_id` (string) – required parent event identifier
- `policy_id` (string) – policy identifier (placeholder acceptable for now)
- `policy_version` (string) – policy version (placeholder acceptable for now)
- `policy_decision_id` (string) – policy decision identifier (placeholder acceptable for now)

### Behavior

- Responds `400` with `missing_required_fields` if any required fields are absent.
- Mints all required fields above into the JWT as claims.

### Example

```bash
curl -sS http://localhost:3001/auth/mint \
  -H 'content-type: application/json' \
  -d '{
    "sub": "user:123",
    "aud": "smart-launch-gateway",
    "scope": "launch",
    "trace_id": "trace_abc",
    "parent_event_id": "evt_root",
    "policy_id": "policy_placeholder",
    "policy_version": "0",
    "policy_decision_id": "decision_placeholder"
  }'
```
