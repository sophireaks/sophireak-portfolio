import { all } from '../lib/dom';

/** Splits [data-roll] text into per-letter spans for the hover roll. Uses DOM APIs only. */
export function initRoll(): void {
  for (const el of all('[data-roll]')) {
    const text = el.textContent ?? '';
    el.textContent = '';
    el.classList.add('roll');
    el.setAttribute('aria-label', text);
    Array.from(text).forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'ch';
      span.dataset['c'] = char;
      span.textContent = char;
      span.style.setProperty('--i', String(i));
      span.setAttribute('aria-hidden', 'true');
      el.appendChild(span);
    });
  }
}
