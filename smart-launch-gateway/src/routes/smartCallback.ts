import type { Request, Response } from 'express';
import fetch from 'node-fetch';
import { pendingAuthStore } from './smartAuthorize';
import { requireStateMatch } from '../security/csrf';
import { validateRedirectUri } from '../security/redirectAllowlist';
import { config } from '../config';

/**
 * SMART /callback handler.
 *
 * Validates state, then "mints" OS-scoped tokens by calling a placeholder kernel endpoint.
 *
 * In a complete implementation, this is where you'd redeem the upstream auth code,
 * validate id_token (nonce), and map SMART scopes to AgenticOS capabilities.
 */

function requireParam(req: Request, name: string): string {
  const v = req.query[name];
  const s = Array.isArray(v) ? v[0] : v;
  if (!s) throw new Error(`missing_${name}`);
  return String(s);
}

export async function smartCallback(req: Request, res: Response) {
  try {
    const code = requireParam(req, 'code');
    const state = requireParam(req, 'state');

    const pending = pendingAuthStore.get(state);
    if (!pending) throw new Error('unknown_state');

    // strict state check (timing-safe compare is inside requireStateMatch)
    requireStateMatch(pending.state, state);

    // Re-validate redirect URI before use (defense-in-depth)
    const redirectUri = validateRedirectUri(pending.redirectUri, config.redirectAllowlist);

    // Placeholder: call kernel to mint OS-scoped token (purpose-bound)
    const kernelResp = await fetch(config.kernelTokenEndpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'smart_authorization_code',
        code,
        client_id: pending.clientId,
        scope: pending.scope,
        aud: pending.aud,
        launch: pending.launch,
        // In real flow you'd include upstream subject, tenant, patient, encounter, etc.
        purpose: 'treatment'
      })
    });

    const kernelPayload = await kernelResp.json().catch(() => ({}));
    if (!kernelResp.ok) {
      throw new Error(kernelPayload?.error ?? 'kernel_token_mint_failed');
    }

    // Redirect back to client redirect_uri with gateway-issued code/token reference.
    // For scaffold, we forward kernel response in fragment-less query params.
    const out = new URL(redirectUri);
    out.searchParams.set('state', state);
    out.searchParams.set('os_token', String(kernelPayload.access_token ?? 'PLACEHOLDER_OS_TOKEN'));
    out.searchParams.set('token_type', String(kernelPayload.token_type ?? 'Bearer'));
    if (kernelPayload.expires_in != null) out.searchParams.set('expires_in', String(kernelPayload.expires_in));

    // One-time use
    pendingAuthStore.delete(state);

    res.redirect(302, out.toString());
  } catch (e: any) {
    res.status(400).json({ error: e?.message ?? 'callback_error' });
  }
}
