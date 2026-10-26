import { describe, expect, it } from 'vitest';
import { emailHref, site } from '../src/data/site';

describe('site data', () => {
  it('uses https for every external link', () => {
    for (const link of site.links) expect(link.href.startsWith('https://')).toBe(true);
  });
  it('has unique service letters and a non-empty marquee', () => {
    const letters = site.services.map((s) => s.letter);
    expect(new Set(letters).size).toBe(letters.length);
    expect(site.marquee.length).toBeGreaterThan(0);
  });
  it('hides email links when no address is set', () => {
    if (site.email === '') expect(emailHref()).toBeNull();
    else expect(emailHref()).toBe(`mailto:${site.email}`);
  });
});
