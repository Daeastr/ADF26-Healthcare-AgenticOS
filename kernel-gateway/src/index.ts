import express from "express";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

/**
 * Token mint stub for local/dev integration.
 *
 * NOTE: This endpoint is intentionally minimal and should be replaced with a
 * real issuer in production.
 */
app.post("/auth/mint", (req, res) => {
  const {
    sub,
    aud,
    scope,
    // New required correlation fields
    trace_id,
    parent_event_id,
    // New required policy decision placeholders
    policy_id,
    policy_version,
    policy_decision_id,
    // Allow optional extras
    ...rest
  } = req.body ?? {};

  const missing: string[] = [];

  // Keep supporting existing required fields if present in this stub
  if (!sub) missing.push("sub");
  if (!aud) missing.push("aud");

  // Tightened requirements
  if (!trace_id) missing.push("trace_id");
  if (!parent_event_id) missing.push("parent_event_id");
  if (!policy_id) missing.push("policy_id");
  if (!policy_version) missing.push("policy_version");
  if (!policy_decision_id) missing.push("policy_decision_id");

  if (missing.length) {
    return res.status(400).json({
      error: "missing_required_fields",
      missing,
    });
  }

  const secret = process.env.JWT_SECRET || "dev-secret";

  // Mint required fields into the token as claims
  const token = jwt.sign(
    {
      sub,
      aud,
      scope,
      trace_id,
      parent_event_id,
      policy_id,
      policy_version,
      policy_decision_id,
      ...rest,
    },
    secret,
    {
      expiresIn: "15m",
      issuer: process.env.JWT_ISSUER || "kernel-gateway",
    }
  );

  return res.json({ access_token: token, token_type: "Bearer", expires_in: 900 });
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`kernel-gateway listening on :${port}`);
});
