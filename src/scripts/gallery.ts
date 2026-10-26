import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { all, maybe, must } from '../lib/dom';
import { cardOpacity, clamp, pad2, progressForIndex, titleMaskOffset } from '../lib/math';
import type { MenuController } from './menu';

/** Pinned 3D carousel. The page works as a plain list without this. */
export function initGallery(reduced: boolean, menu: MenuController): void {
  const showcase = maybe('.showcase');
  const ring = maybe('#ring');
  if (showcase === null || ring === null) return;

  const cards = all('.card', ring);
  const count = cards.length;
  if (count === 0) return;
  ring.setAttribute('aria-hidden', 'true');

  const titleEl = must('#pjText');
  const maskEl = must('#pjMask');
  const descEl = must('#pjDesc');
  const tagsEl = must('#pjTags');
  const linkEl = must<HTMLAnchorElement>('#pjLink');
  const countEl = must('#count');
  const prev = must<HTMLButtonElement>('#prev');
  const next = must<HTMLButtonElement>('#next');

  let target = 0;
  let current = 0;
  let active = -1;
  let step = 40;
  let radius = 900;

  function measure(): void {
    const mobile = window.innerWidth < 800;
    step = mobile ? 46 : 40;
    const width = cards[0]?.offsetWidth ?? 600;
    radius = width * (mobile ? 1.0 : 1.5);
  }
  measure();
  window.addEventListener('resize', measure);

  ScrollTrigger.create({
    trigger: showcase,
    start: 'top top',
    end: 'bottom bottom',
    ...(reduced
      ? {}
      : {
          snap: {
            snapTo: 1 / (count - 1 || 1),
            duration: { min: 0.25, max: 0.7 },
            delay: 0.1,
            ease: 'power2.inOut',
          },
        }),
    onUpdate: (self) => {
      target = self.progress * (count - 1);
    },
  });

  function setInfo(index: number, animate: boolean): void {
    const card = cards[index];
    if (card === undefined) return;
    titleEl.textContent = card.dataset['title'] ?? '';
    descEl.textContent = card.dataset['desc'] ?? '';
    tagsEl.textContent = card.dataset['tags'] ?? '';
    linkEl.href = card.dataset['href'] ?? '/projects/';
    countEl.textContent = `${pad2(index + 1)} / ${pad2(count)}`;
    prev.classList.toggle('btn-disabled', index === 0);
    next.classList.toggle('btn-disabled', index === count - 1);
    if (animate && !reduced) {
      gsap.fromTo(
        [descEl, tagsEl, linkEl],
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: 'power3.out', overwrite: true },
      );
    }
  }
  setInfo(0, false);

  gsap.ticker.add(() => {
    current += (target - current) * (reduced ? 1 : 0.09);
    if (Math.abs(target - current) < 0.0005) current = target;

    cards.forEach((el, i) => {
      const d = i - current;
      const o = cardOpacity(d);
      el.style.opacity = o.toFixed(3);
      el.style.visibility = o <= 0 ? 'hidden' : 'visible';
      el.style.transform = `translate3d(-50%,-50%,${radius}px) rotateY(${-d * step}deg) translateZ(${-radius}px)`;
      el.style.zIndex = String(100 - Math.round(Math.abs(d) * 10));
    });

    const index = clamp(Math.round(current), 0, count - 1);
    if (index !== active) {
      active = index;
      setInfo(index, true);
    }
    maskEl.style.transform = `translateX(${titleMaskOffset(current, index).toFixed(2)}%)`;
  });

  function goTo(index: number): void {
    const progress = progressForIndex(index, count);
    const span = showcase?.offsetHeight ?? 0;
    const y = (showcase?.offsetTop ?? 0) + progress * (span - window.innerHeight);
    gsap.to(window, { duration: 1, scrollTo: { y, autoKill: false }, ease: 'expo.inOut' });
  }
  prev.addEventListener('click', () => goTo(Math.round(target) - 1));
  next.addEventListener('click', () => goTo(Math.round(target) + 1));

  let startX = 0;
  let startY = 0;
  showcase.addEventListener(
    'touchstart',
    (e) => {
      const t = e.touches[0];
      if (t !== undefined) {
        startX = t.clientX;
        startY = t.clientY;
      }
    },
    { passive: true },
  );
  showcase.addEventListener(
    'touchend',
    (e) => {
      const t = e.changedTouches[0];
      if (t === undefined) return;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5)
        goTo(Math.round(target) + (dx < 0 ? 1 : -1));
    },
    { passive: true },
  );

  document.addEventListener('keydown', (e) => {
    if (menu.isOpen()) return;
    const rect = showcase.getBoundingClientRect();
    if (rect.top > 0 || rect.bottom < window.innerHeight) return;
    if (e.key === 'ArrowRight') goTo(Math.round(target) + 1);
    if (e.key === 'ArrowLeft') goTo(Math.round(target) - 1);
  });
}
