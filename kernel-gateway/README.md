# kernel-gateway (minimal token mint stub)

Minimal Node/TypeScript service providing a **Phase 3** stub token mint endpoint.

## Endpoint

- `POST /auth/mint`

Accepts a JSON body compatible with the `smart-launch-gateway` token exchange and returns:

```json
{ "access_token": "...", "token_type": "Bearer", "expires_in": 3600 }
```

## Local dev

```bash
cd kernel-gateway
cp .env.example .env
npm install
npm run dev
```

Service listens on `http://localhost:8788` by default.

## Environment variables

- `PORT` (default `8788`)
- `TOKEN_SIGNING_SECRET` (**required**) HS256 secret
- `TOKEN_ISSUER` (default `http://localhost:<PORT>`)
- `TOKEN_AUDIENCE_DEFAULT` (used if request omits `audience`)
- `TOKEN_TTL_SECONDS` (default `3600`)
