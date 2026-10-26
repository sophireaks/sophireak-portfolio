/** Labels shown on the theme button. Colors live in src/styles/tokens.css under [data-theme]. */
export const THEME_LABELS = ['THEME', 'DARK MODE?', 'HACKER MODE?', 'NAVY?', 'RED TEAM?'] as const;

export const THEME_COUNT = THEME_LABELS.length;
export const THEME_KEY = 'theme';

export function nextTheme(current: number): number {
  return (current + 1) % THEME_COUNT;
}

export function parseTheme(raw: string | null): number {
  if (raw === null) return 0;
  const n = Number.parseInt(raw, 10);
  return Number.isInteger(n) && n >= 0 && n < THEME_COUNT ? n : 0;
}
