import { gsap } from 'gsap';
import { must } from '../lib/dom';
import { THEME_KEY, THEME_LABELS, nextTheme, parseTheme } from '../lib/themes';

function readStored(): number {
  try {
    return parseTheme(localStorage.getItem(THEME_KEY));
  } catch {
    return 0;
  }
}

function store(value: number): void {
  try {
    localStorage.setItem(THEME_KEY, String(value));
  } catch {
    /* storage can be blocked; the theme still applies for this visit */
  }
}

export function initTheme(reduced: boolean): void {
  const button = must<HTMLButtonElement>('#theme');
  const label = must('#themeText');
  let state = readStored();
  document.documentElement.setAttribute('data-theme', String(state));
  label.textContent = THEME_LABELS[state] ?? THEME_LABELS[0];

  button.addEventListener('click', () => {
    state = nextTheme(state);
    document.documentElement.setAttribute('data-theme', String(state));
    store(state);
    const text = THEME_LABELS[state] ?? THEME_LABELS[0];
    if (reduced) label.textContent = text;
    else gsap.to(label, { duration: 0.7, text, ease: 'none' });
  });
}
