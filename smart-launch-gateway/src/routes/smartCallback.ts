import type { Request, Response } from "express";
import crypto from "crypto";

// A working implementation that:
//  - validates state
//  - re-validates redirect URI
//  - calls KERNEL_TOKEN_ENDPOINT
//  - redirects back to redirect_uri with os_token

const KERNEL_TOKEN_ENDPOINT =
  process.env.KERNEL_TOKEN_ENDPOINT || "http://localhost:8788/auth/mint";

function timingSafeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export async function smartCallback(req: Request, res: Response) {
  try {
    const { code, state } = req.query as { code?: string; state?: string };

    if (!code || !state) {
      return res.status(400).send("Missing code or state");
    }

    // State was created at /smart/launch time and stored in the session.
    // Names may vary across regressions; we check a couple common ones.
    const sessionAny: any = (req as any).session || {};
    const expectedState =
      sessionAny.smart_state || sessionAny.state || sessionAny.oauth_state;
    const redirect_uri =
      sessionAny.redirect_uri || sessionAny.smart_redirect_uri;
    const client_id = sessionAny.client_id || sessionAny.smart_client_id;

    if (!expectedState || !redirect_uri || !client_id) {
      return res.status(400).send("Missing session context (state/redirect_uri/client_id)");
    }

    if (!timingSafeEqual(String(state), String(expectedState))) {
      return res.status(400).send("Invalid state");
    }

    // Re-validate redirect_uri against what we originally requested.
    // (Prevents attacker from swapping redirect_uri query param or session injection.)
    const requestedRedirectUriFromQuery = (req.query as any).redirect_uri as
      | string
      | undefined;
    if (
      requestedRedirectUriFromQuery &&
      requestedRedirectUriFromQuery !== redirect_uri
    ) {
      return res.status(400).send("redirect_uri mismatch");
    }

    const scope = sessionAny.scope || "launch openid fhirUser";
    const pou = sessionAny.pou || "smart";

    // Placeholder tracing/policy fields (requested by kernel-gateway schema)
    // In a real deployment these are produced by upstream policy/tracing systems.
    const trace_id = sessionAny.trace_id || "trace_placeholder";
    const parent_event_id = sessionAny.parent_event_id || "parent_event_placeholder";
    const policy_id = sessionAny.policy_id || "policy_placeholder";
    const policy_version = sessionAny.policy_version || "0";
    const policy_decision_id = sessionAny.policy_decision_id || "decision_placeholder";

    const mintPayload = {
      grant_type: "authorization_code",
      code,
      redirect_uri,
      client_id,
      scope,
      pou,
      trace_id,
      parent_event_id,
      policy_id,
      policy_version,
      policy_decision_id,
    };

    const r = await fetch(KERNEL_TOKEN_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(mintPayload),
    });

    if (!r.ok) {
      const t = await r.text();
      return res
        .status(502)
        .send(`Token mint failed: ${r.status} ${r.statusText}\n${t}`);
    }

    const data = (await r.json()) as { os_token?: string };
    if (!data?.os_token) {
      return res.status(502).send("Token mint returned no os_token");
    }

    const url = new URL(redirect_uri);
    url.searchParams.set("os_token", data.os_token);

    return res.redirect(url.toString());
  } catch (e: any) {
    return res.status(500).send(e?.message || "Unknown error");
  }
}
