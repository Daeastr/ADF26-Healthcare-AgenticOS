import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { SignJWT } from "jose";

const app = express();
app.use(bodyParser.json());

// Keep legacy default port (regression fix)
const PORT = process.env.PORT ? Number(process.env.PORT) : 8788;

// HS256 signing secret (shared between gateways)
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

/**
 * /auth/mint
 *
 * This endpoint mints an OS token (JWT) for the smart-launch-gateway.
 *
 * Required fields (aligned with smart-launch-gateway legacy schema):
 *  - grant_type
 *  - code
 *  - redirect_uri
 *  - client_id
 *  - scope
 *  - pou
 *
 * Additional required tracing/policy fields:
 *  - trace_id
 *  - parent_event_id
 *  - policy_id
 *  - policy_version
 *  - policy_decision_id
 */
app.post("/auth/mint", async (req: Request, res: Response) => {
  try {
    const {
      grant_type,
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
    } = req.body || {};

    const missing: string[] = [];
    for (const [k, v] of Object.entries({
      grant_type,
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
    })) {
      if (v === undefined || v === null || v === "") missing.push(k);
    }

    if (missing.length) {
      return res.status(400).json({
        error: "invalid_request",
        error_description: `Missing required field(s): ${missing.join(", ")}`,
      });
    }

    // Mint JWT claims, keeping legacy behavior (no jsonwebtoken; use jose)
    // Include tracing/policy fields as claims
    const now = Math.floor(Date.now() / 1000);
    const jwt = await new SignJWT({
      scope,
      pou,
      trace_id,
      parent_event_id,
      policy_id,
      policy_version,
      policy_decision_id,
      // Keep legacy request context as non-standard claims for debugging/auditing
      grant_type,
      code,
      redirect_uri,
      client_id,
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt(now)
      .setExpirationTime(now + 60 * 10) // 10 minutes
      .sign(new TextEncoder().encode(JWT_SECRET));

    res.json({ os_token: jwt, token_type: "bearer", expires_in: 600 });
  } catch (e: any) {
    res.status(500).json({
      error: "server_error",
      error_description: e?.message || "Unknown error",
    });
  }
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`kernel-gateway listening on port ${PORT}`);
});
