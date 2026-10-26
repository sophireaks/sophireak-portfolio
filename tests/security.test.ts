import { describe, expect, it } from 'vitest';
import {
  CSP_DIRECTIVES,
  CSP_HEADER,
  CSP_META,
  SECURITY_HEADERS,
  renderHeadersFile,
} from '../src/lib/security';

describe('content security policy', () => {
  it('never allows inline or eval code', () => {
    expect(CSP_HEADER).not.toContain('unsafe-inline');
    expect(CSP_HEADER).not.toContain('unsafe-eval');
  });
  it('starts from default-src none', () => {
    expect(CSP_DIRECTIVES['default-src']).toEqual(["'none'"]);
  });
  it('only allows same-origin scripts and styles', () => {
    expect(CSP_DIRECTIVES['script-src']).toEqual(["'self'"]);
    expect(CSP_DIRECTIVES['style-src']).toEqual(["'self'"]);
  });
  it('restricts inline style attributes to a fixed hash allowlist', () => {
    const allow = CSP_DIRECTIVES['style-src-attr'] ?? [];
    expect(allow[0]).toBe("'unsafe-hashes'");
    for (const entry of allow.slice(1)) expect(entry).toMatch(/^'sha256-[A-Za-z0-9+/]{43}='$/);
    expect(allow).not.toContain("'unsafe-inline'");
  });
  it('contains no remote origins', () => {
    expect(CSP_HEADER).not.toMatch(/https?:\/\//);
  });
  it('keeps header-only directives out of the meta policy', () => {
    expect(CSP_META).not.toContain('frame-ancestors');
    expect(CSP_HEADER).toContain("frame-ancestors 'none'");
  });
});

describe('response headers', () => {
  it('sets the core hardening headers', () => {
    for (const name of [
      'Content-Security-Policy',
      'X-Content-Type-Options',
      'Referrer-Policy',
      'Permissions-Policy',
      'Strict-Transport-Security',
      'Cross-Origin-Opener-Policy',
    ]) {
      expect(SECURITY_HEADERS).toHaveProperty(name);
    }
    expect(SECURITY_HEADERS['X-Content-Type-Options']).toBe('nosniff');
  });
  it('renders a _headers file with long caching only for fingerprinted assets', () => {
    const file = renderHeadersFile();
    expect(file).toContain('/*');
    expect(file).toContain('/_astro/*');
    expect(file.split('/_astro/*')[0]).not.toContain('Cache-Control');
  });
});
