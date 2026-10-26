# Security

## Reporting

Found a problem? Open a private security advisory on the GitHub repository
(Security tab, "Report a vulnerability") or email the address listed on the site.
Please do not open a public issue for vulnerabilities.

## Model

This is a static site. There is no server code, no database, no forms and no
user input, which removes most of the attack surface by design.

- **CSP**: `default-src 'none'`; scripts, styles, fonts, images and connections
  are `'self'` only. No `unsafe-inline` or `unsafe-eval` for scripts or style
  elements. Inline `style=""` attributes (set by SplitType) are allowed only by
  sha256 hash. The policy lives in `src/lib/security.ts` and is emitted both as
  a `<meta>` tag and into `dist/_headers`.
- **Headers** (`dist/_headers`): nosniff, Referrer-Policy, Permissions-Policy,
  COOP, CORP, HSTS, X-Frame-Options, `frame-ancestors 'none'`.
- **No third-party requests**: fonts and libraries are bundled and self-hosted.
- **Supply chain**: lockfile committed, `npm ci --ignore-scripts` in CI,
  `npm audit` on production deps, Dependabot weekly.
- **Build guard**: `scripts/check-dist.mjs` fails the build on inline scripts,
  inline handlers, remote scripts or links, a missing CSP meta tag, or
  `target="_blank"` without `noopener`.
- **Lint rules** forbid `innerHTML`, `outerHTML`, `insertAdjacentHTML` and `eval`.

## Limits

GitHub Pages cannot send custom HTTP headers, so only the `<meta>` CSP applies
there (`frame-ancestors`, HSTS and the other headers are ignored in a meta tag).
For the full header set deploy on Cloudflare Pages or Netlify, which read
`dist/_headers`.
