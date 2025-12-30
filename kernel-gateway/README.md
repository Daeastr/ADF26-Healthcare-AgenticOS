# kernel-gateway

Minimal gateway that mints an **OS token** (JWT) for the smart-launch-gateway.

## Running

```bash
npm install
npm run dev
```

By default the server listens on **port 8788**.

## Configuration

- `PORT` (optional): listening port. Defaults to `8788`.
- `JWT_SECRET` (optional): HS256 signing secret used to mint JWTs.

## POST `/auth/mint`

Mints an `os_token` using **HS256** (jose `SignJWT`).

### Request body (JSON)

Required fields (aligned with `smart-launch-gateway` legacy schema):

- `grant_type` (string)
- `code` (string)
- `redirect_uri` (string)
- `client_id` (string)
- `scope` (string)
- `pou` (string)

Additional required tracing/policy fields:

- `trace_id` (string)
- `parent_event_id` (string)
- `policy_id` (string)
- `policy_version` (string)
- `policy_decision_id` (string)

### Response

```json
{
  "os_token": "<jwt>",
  "token_type": "bearer",
  "expires_in": 600
}
```
