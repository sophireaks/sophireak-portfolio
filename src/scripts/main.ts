import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { TextPlugin } from 'gsap/TextPlugin';
import { prefersReducedMotion } from '../lib/dom';
import { initAbout } from './about';
import { initAnchors } from './anchors';
import { initDots } from './dots';
import { initGallery } from './gallery';
import { initHero, revealHero } from './hero';
import { initMenu } from './menu';
import { initReveal } from './reveal';
import { initRoll } from './roll';
import { initTheme } from './theme';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);

function boot(): void {
  const root = document.documentElement;
  const reduced = prefersReducedMotion();
  if (reduced) root.classList.add('reduce');

  initRoll();
  initTheme(reduced);
  const menu = initMenu(reduced);
  initAnchors(menu);

  try {
    initDots();
    initHero(reduced);
  } catch (error) {
    console.error(error);
    revealHero();
  }

  let revealer: ReturnType<typeof initReveal> | null = null;
  try {
    initAbout(reduced);
    initGallery(reduced, menu);
    revealer = initReveal(reduced);
  } catch (error) {
    console.error(error);
  }

  let lastWidth = window.innerWidth;
  let timer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      revealer?.rebuild();
      ScrollTrigger.refresh();
    }, 300);
  });

  root.classList.add('ready');
  ScrollTrigger.refresh();
}

// Do not wait on web fonts forever; start after at most 800 ms.
void Promise.race([
  document.fonts.ready,
  new Promise<void>((resolve) => window.setTimeout(resolve, 800)),
]).then(boot);
