import { describe, expect, it } from 'vitest';
import { THEME_COUNT, THEME_LABELS, nextTheme, parseTheme } from '../src/lib/themes';

describe('parseTheme', () => {
  it('accepts valid indices', () => {
    for (let i = 0; i < THEME_COUNT; i++) expect(parseTheme(String(i))).toBe(i);
  });
  it('falls back to the default for anything else', () => {
    expect(parseTheme(null)).toBe(0);
    expect(parseTheme('')).toBe(0);
    expect(parseTheme('abc')).toBe(0);
    expect(parseTheme('-1')).toBe(0);
    expect(parseTheme(String(THEME_COUNT))).toBe(0);
    expect(parseTheme('1.5')).toBe(1);
  });
});

describe('nextTheme', () => {
  it('cycles and wraps', () => {
    expect(nextTheme(0)).toBe(1);
    expect(nextTheme(THEME_COUNT - 1)).toBe(0);
  });
  it('has a label for every theme', () => {
    expect(THEME_LABELS).toHaveLength(THEME_COUNT);
  });
});
