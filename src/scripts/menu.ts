import { gsap } from 'gsap';
import { all, must } from '../lib/dom';

export interface MenuController {
  readonly isOpen: () => boolean;
  readonly close: () => void;
}

export function initMenu(reduced: boolean): MenuController {
  const menu = must('#menu');
  const button = must<HTMLButtonElement>('#menuBtn');
  const panel = must('.menu-panel', menu);

  gsap.set(panel, { xPercent: 100 });
  gsap.set('.menu-dim', { opacity: 0 });

  const timeline = gsap
    .timeline({ paused: true, defaults: { ease: 'expo.inOut' } })
    .set(menu, { visibility: 'visible' })
    .to('.menu-dim', { opacity: 1, duration: 0.6 }, 0)
    .to(panel, { xPercent: 0, duration: 0.9 }, 0)
    .from(
      '.menu-links .lw > a',
      { yPercent: 115, duration: 0.9, stagger: 0.08, ease: 'power4.out' },
      0.35,
    )
    .from(
      '.menu-contact > *',
      { autoAlpha: 0, y: 12, stagger: 0.06, duration: 0.6, ease: 'power2.out' },
      0.6,
    );

  if (reduced) timeline.timeScale(1000);

  let open = false;

  function set(next: boolean): void {
    open = next;
    document.body.classList.toggle('menu-open', open);
    button.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    menu.toggleAttribute('inert', !open);
    if (open) {
      timeline.timeScale(reduced ? 1000 : 1).play();
      all<HTMLAnchorElement>('.menu-links a', menu)[0]?.focus({ preventScroll: true });
    } else {
      timeline.timeScale(reduced ? 1000 : 1.2).reverse();
      button.focus({ preventScroll: true });
    }
  }

  button.addEventListener('click', () => set(!open));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) set(false);
  });

  return { isOpen: () => open, close: () => set(false) };
}
