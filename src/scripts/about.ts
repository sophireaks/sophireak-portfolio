import { gsap } from 'gsap';
import { maybe } from '../lib/dom';

/** Draws the ring and opens the circle mask when the About graphic scrolls into view. */
export function initAbout(reduced: boolean): void {
  const svg = maybe<SVGSVGElement>('svg.scrolling-svg');
  if (svg === null) return;
  const ring = maybe<SVGCircleElement>('.ring-path', svg);
  const circle = maybe<SVGCircleElement>('.distortion', svg);
  const image = maybe<SVGGElement>('.svg-image', svg);
  if (ring === null || circle === null || image === null) return;

  const length = ring.getTotalLength();
  ring.style.strokeDasharray = String(length);
  ring.style.strokeDashoffset = reduced ? '0' : String(length);
  if (reduced) {
    circle.setAttribute('r', '332');
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0]?.isIntersecting) return;
      observer.disconnect();
      gsap.to(ring, { strokeDashoffset: 0, duration: 1.2, ease: 'power4.out' });
      gsap.fromTo(
        image,
        { scale: 0.9, transformOrigin: '50% 50%' },
        { scale: 1, duration: 1.2, ease: 'power4.out' },
      );
      gsap.to(circle, { attr: { r: 332 }, duration: 1.6, ease: 'power4.out', delay: 0.2 });
    },
    { threshold: 0.4 },
  );
  observer.observe(svg);
}
