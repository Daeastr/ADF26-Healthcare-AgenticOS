import dotenv from 'dotenv';

dotenv.config();

export type Config = {
  port: number;
  baseUrl: string; // public base URL of this gateway
  redirectAllowlist: string[]; // strict allowlist of exact redirect URIs
  cookieSecret: string; // used to sign/encrypt cookies in a future iteration
  kernelTokenEndpoint: string; // placeholder kernel endpoint to mint OS-scoped tokens
  kernelAudience: string; // aud for kernel token calls
};

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const config: Config = {
  port: Number(process.env.PORT ?? '8787'),
  baseUrl: required('GATEWAY_BASE_URL'),
  redirectAllowlist: (process.env.REDIRECT_ALLOWLIST ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  cookieSecret: required('COOKIE_SECRET'),
  kernelTokenEndpoint: required('KERNEL_TOKEN_ENDPOINT'),
  kernelAudience: process.env.KERNEL_AUDIENCE ?? 'agenticos-kernel'
};

if (config.redirectAllowlist.length === 0) {
  throw new Error('REDIRECT_ALLOWLIST must contain at least one exact redirect URI');
}
