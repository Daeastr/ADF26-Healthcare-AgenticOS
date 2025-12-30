import { createHash, randomBytes } from 'crypto';

export type PkcePair = {
  verifier: string;
  challenge: string;
  method: 'S256';
};

// RFC 7636: verifier length 43-128, URL-safe base64.
export function generateVerifier(bytes = 32): string {
  const b64 = randomBytes(bytes).toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function challengeS256(verifier: string): string {
  const hash = createHash('sha256').update(verifier).digest('base64');
  return hash.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function requirePkceS256(query: Record<string, any>) {
  const method = String(query.code_challenge_method ?? '');
  const challenge = String(query.code_challenge ?? '');
  if (method !== 'S256') throw new Error('pkce_method_required');
  if (!challenge || challenge.length < 43) throw new Error('pkce_challenge_required');
}

export function makePkce(): PkcePair {
  const verifier = generateVerifier(32);
  return { verifier, challenge: challengeS256(verifier), method: 'S256' };
}
