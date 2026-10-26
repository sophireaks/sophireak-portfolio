import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { all } from '../lib/dom';

interface Revealer {
  readonly rebuild: () => void;
}

/** Line-by-line text reveal tied to scroll, plus simple fade-ups for lists. */
export function initReveal(reduced: boolean): Revealer {
  let splits: SplitType[] = [];
  let timelines: gsap.core.Timeline[] = [];

  function teardown(): void {
    for (const tl of timelines) {
      tl.scrollTrigger?.kill();
      tl.kill();
    }
    for (const s of splits) s.revert();
    timelines = [];
    splits = [];
  }

  function build(): void {
    if (reduced) return;
    teardown();
    for (const el of all('.t-anim')) {
      const split = new SplitType(el, { types: 'lines,words' });
      splits.push(split);
      for (const line of split.lines ?? []) {
        const mask = document.createElement('div');
        mask.className = 'line-mask';
        line.appendChild(mask);
        const tl = gsap.timeline({
          scrollTrigger: { trigger: line, start: 'top 100%', end: 'top 58%', scrub: 1 },
        });
        tl.to(mask, { left: '100%', ease: 'power1.out', duration: 1.5 }).fromTo(
          line,
          { scale: 0.9, rotate: 3, autoAlpha: 0, y: 20 },
          { scale: 1, rotate: 0, autoAlpha: 1, y: 0, ease: 'power1.out', duration: 1.5 },
          '<',
        );
        timelines.push(tl);
      }
    }
  }

  if (!reduced) {
    if (document.querySelector('.svc') !== null) {
      gsap.from('.svc li', {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.svc', start: 'top 82%' },
      });
    }
    if (document.querySelector('.contact') !== null) {
      gsap.from('.contact .links a, .contact .status', {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.contact', start: 'top 60%' },
      });
    }
  }

  build();
  void ScrollTrigger;
  return { rebuild: build };
}
