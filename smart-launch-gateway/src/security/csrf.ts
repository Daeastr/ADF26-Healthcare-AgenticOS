import { randomBytes, timingSafeEqual } from 'crypto';

export function generateState(bytes = 16): string {
  return randomBytes(bytes).toString('hex');
}

export function generateNonce(bytes = 16): string {
  return randomBytes(bytes).toString('hex');
}

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function requireStateMatch(expected: string, received: string) {
  if (!expected || !received || !safeEqual(expected, received)) {
    throw new Error('invalid_state');
  }
}

export function requireNonceMatch(expected: string, received: string) {
  if (!expected || !received || !safeEqual(expected, received)) {
    throw new Error('invalid_nonce');
  }
}
