import express from 'express';
import dotenv from 'dotenv';
import { SignJWT } from 'jose';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
app.use(express.json({ limit: '1mb' }));

const PORT = parseInt(process.env.PORT || '8788', 10);
const TOKEN_SIGNING_SECRET = process.env.TOKEN_SIGNING_SECRET;
if (!TOKEN_SIGNING_SECRET) {
  // Fail fast so we don't mint unsigned/weak tokens.
  throw new Error('Missing required env var TOKEN_SIGNING_SECRET');
}

const issuer = process.env.TOKEN_ISSUER || `http://localhost:${PORT}`;
const audienceDefault = process.env.TOKEN_AUDIENCE_DEFAULT || 'smart-launch-gateway';
const ttlSeconds = parseInt(process.env.TOKEN_TTL_SECONDS || '3600', 10);

type MintRequestBody = {
  grant_type?: string;
  code?: string;
  redirect_uri?: string;
  client_id?: string;
  scope?: string;
  audience?: string;
  purpose?: string; // maps to 'pou' claim
};

function requireString(body: any, key: string): string {
  const val = body?.[key];
  if (typeof val !== 'string' || val.trim().length === 0) {
    throw new Error(`Missing or invalid required field: ${key}`);
  }
  return val;
}

app.post('/auth/mint', async (req, res) => {
  try {
    const body = (req.body || {}) as MintRequestBody;

    // Minimal allowlist check
    const grantType = requireString(body, 'grant_type');
    if (grantType !== 'smart_authorization_code') {
      return res.status(400).json({
        error: 'unsupported_grant_type',
        error_description: 'Only grant_type smart_authorization_code is allowed'
      });
    }

    // Validate basic fields used by typical exchange
    requireString(body, 'code');
    requireString(body, 'redirect_uri');
    requireString(body, 'client_id');

    // Not strictly required by RFC, but expected for this flow.
    const scope = requireString(body, 'scope');

    const audience = (typeof body.audience === 'string' && body.audience.trim().length > 0)
      ? body.audience
      : audienceDefault;

    const now = Math.floor(Date.now() / 1000);
    const exp = now + (Number.isFinite(ttlSeconds) ? ttlSeconds : 3600);

    const jwt = await new SignJWT({
      scope,
      pou: typeof body.purpose === 'string' ? body.purpose : undefined
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuer(issuer)
      // Placeholder subject; replace with real user/patient identity as kernel matures.
      .setSubject('placeholder-subject')
      .setAudience(audience)
      .setIssuedAt(now)
      .setExpirationTime(exp)
      .setJti(uuidv4())
      .sign(new TextEncoder().encode(TOKEN_SIGNING_SECRET));

    return res.json({
      access_token: jwt,
      token_type: 'Bearer',
      expires_in: exp - now
    });
  } catch (err: any) {
    return res.status(400).json({
      error: 'invalid_request',
      error_description: err?.message || 'Invalid request'
    });
  }
});

app.get('/healthz', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[kernel-gateway] listening on :${PORT}`);
});
