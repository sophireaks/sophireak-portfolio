import { gsap } from 'gsap';
import type { MenuController } from './menu';

/** Smooth in-page scrolling for links that point at the current page. */
export function initAnchors(menu: MenuController): void {
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest('a') : null;
    if (link === null || link.target === '_blank') return;

    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname) return;

    const hash = url.hash;
    const target = hash === '' || hash === '#top' ? 0 : document.getElementById(hash.slice(1));
    if (target === null) return;

    event.preventDefault();
    const go = (): void => {
      gsap.to(window, {
        duration: 1.3,
        scrollTo: { y: target, autoKill: true },
        ease: 'expo.inOut',
      });
    };
    if (menu.isOpen()) {
      menu.close();
      window.setTimeout(go, 650);
    } else {
      go();
    }
  });
}
