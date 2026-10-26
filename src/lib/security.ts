/**
 * Single source of truth for the Content Security Policy and response headers.
 * - Base.astro renders the policy into a <meta> tag (covers hosts that cannot set headers).
 * - integrations/security-headers.ts writes the full set into dist/_headers at build time
 *   (Cloudflare Pages and Netlify read this file).
 * Keep the policy strict: no 'unsafe-inline', no 'unsafe-eval', no third-party origins.
 */

type Directives = Record<string, readonly string[]>;

const STYLE_ATTR_ALLOWLIST = [
  "'unsafe-hashes'",
  "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='",
  "'sha256-BSTKIYoPCaklkJ9YS/ZVYuKW8e+DG8jZJCXznBzHjgg='",
  "'sha256-kMHp1r+Lx5eAgyPzDMyTdn8RYvhMWffs4miPzZgHJss='",
  "'sha256-8K0LKM4bCuabz7Sy99y+iuBYkrad2/TXjAi1Mo64ok0='",
  "'sha256-HmWfpWkgT0BKy3os9JN2+hLwLn4jPHlUbmP9Fo1Xofw='",
  "'sha256-QwSy+1GFI2naU96ERFqhAT4LSrvFWNvuQz+EsqAbWxE='",
] as const;

export const CSP_DIRECTIVES: Directives = {
  'default-src': ["'none'"],
  'script-src': ["'self'"],
  'style-src': ["'self'"],
  // Inline style attributes are blocked except for these exact values, matched by hash:
  //  - '' : GSAP ScrollTrigger runs setAttribute('style', '') once to force a reflow.
  //  - SplitType writes 'display: inline-block;' on words and 'display: block; text-align: X;
  //    width: 100%;' on lines. The same rules also exist in global.css.
  // Any other inline style, including injected markup, is still refused.
  'style-src-attr': STYLE_ATTR_ALLOWLIST,
  'img-src': ["'self'", 'data:'],
  'font-src': ["'self'"],
  'connect-src': ["'self'"],
  'manifest-src': ["'self'"],
  'base-uri': ["'none'"],
  'form-action': ["'none'"],
  'object-src': ["'none'"],
};

/** Directives that browsers ignore inside a <meta> policy. They are sent as headers only. */
export const CSP_HEADER_ONLY: Directives = {
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
};

function serialize(directives: Directives): string {
  return Object.entries(directives)
    .map(([name, values]) => (values.length > 0 ? `${name} ${values.join(' ')}` : name))
    .join('; ');
}

export const CSP_META = serialize(CSP_DIRECTIVES);
export const CSP_HEADER = serialize({ ...CSP_DIRECTIVES, ...CSP_HEADER_ONLY });

export const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  'Content-Security-Policy': CSP_HEADER,
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
};

/** Long-lived caching for fingerprinted build output only. */
export const IMMUTABLE_CACHE = 'public, max-age=31536000, immutable';

export function renderHeadersFile(): string {
  const lines: string[] = ['/*'];
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) lines.push(`  ${name}: ${value}`);
  lines.push('', '/_astro/*', `  Cache-Control: ${IMMUTABLE_CACHE}`, '');
  return lines.join('\n');
}
