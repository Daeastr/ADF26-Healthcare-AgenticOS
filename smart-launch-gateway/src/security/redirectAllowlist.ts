/**
 * Strict redirect URI allowlist validation.
 *
 * - Exact match only (no partial, no wildcard, no open redirect patterns)
 * - Requires https (except optional localhost for dev)
 */

export function validateRedirectUri(candidate: string, allowlist: string[]): string {
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error('invalid_redirect_uri');
  }

  const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  if (url.protocol !== 'https:' && !isLocalhost) {
    throw new Error('redirect_uri_must_be_https');
  }

  // Normalize in a stable way for exact comparisons.
  // NOTE: URL.toString() may add trailing slash depending on input; we compare both forms.
  const normalized = url.toString();
  const normalizedNoSlash = normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;

  const allow = new Set(
    allowlist.flatMap((raw) => {
      try {
        const a = new URL(raw);
        const s = a.toString();
        return s.endsWith('/') ? [s, s.slice(0, -1)] : [s, s + '/'];
      } catch {
        return [];
      }
    })
  );

  if (!allow.has(normalized) && !allow.has(normalizedNoSlash)) {
    throw new Error('redirect_uri_not_allowed');
  }

  return normalized;
}
