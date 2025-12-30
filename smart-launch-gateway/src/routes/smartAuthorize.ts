import type { Request, Response } from 'express';
import { config } from '../config';
import { validateRedirectUri } from '../security/redirectAllowlist';
import { requirePkceS256 } from '../security/pkce';
import { generateNonce, generateState } from '../security/csrf';

/**
 * SMART /authorize gateway entry.
 *
 * This scaffold DOES NOT proxy to an upstream IdP/EHR yet.
 * It validates redirect URI and requires PKCE S256.
 * It then issues a gateway session (in-memory for now) and redirects to /smart/callback
 * simulating the authorization code redirect.
 */

export type PendingAuth = {
  createdAt: number;
  redirectUri: string;
  clientId: string;
  scope: string;
  state: string;
  nonce: string;
  codeChallenge: string;
  codeChallengeMethod: 'S256';
  aud?: string;
  launch?: string;
};

export const pendingAuthStore = new Map<string, PendingAuth>();

function requireParam(req: Request, name: string): string {
  const v = req.query[name];
  const s = Array.isArray(v) ? v[0] : v;
  if (!s) throw new Error(`missing_${name}`);
  return String(s);
}

export async function smartAuthorize(req: Request, res: Response) {
  try {
    // Required by SMART
    const redirect_uri = validateRedirectUri(requireParam(req, 'redirect_uri'), config.redirectAllowlist);
    const client_id = requireParam(req, 'client_id');
    const scope = requireParam(req, 'scope');

    // Enforce PKCE S256 mandatory
    requirePkceS256(req.query as any);
    const code_challenge = String(req.query.code_challenge);

    // state required in OAuth2; nonce required for OIDC (recommended in SMART)
    const state = String(req.query.state ?? generateState());
    const nonce = String(req.query.nonce ?? generateNonce());

    const aud = req.query.aud ? String(req.query.aud) : undefined;
    const launch = req.query.launch ? String(req.query.launch) : undefined;

    // Store pending transaction bound to state (minimal for scaffold)
    pendingAuthStore.set(state, {
      createdAt: Date.now(),
      redirectUri: redirect_uri,
      clientId: client_id,
      scope,
      state,
      nonce,
      codeChallenge: code_challenge,
      codeChallengeMethod: 'S256',
      aud,
      launch
    });

    // In a real gateway, you'd redirect to upstream authorization server.
    // Here, we simulate by immediately redirecting to our callback with a fake code.
    const callbackUrl = new URL(config.baseUrl + '/smart/callback');
    callbackUrl.searchParams.set('code', 'PLACEHOLDER_AUTH_CODE');
    callbackUrl.searchParams.set('state', state);

    res.redirect(302, callbackUrl.toString());
  } catch (e: any) {
    res.status(400).json({ error: e?.message ?? 'authorization_error' });
  }
}
