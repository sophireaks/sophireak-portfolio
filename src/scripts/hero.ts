import { gsap } from 'gsap';
import SplitType from 'split-type';
import { maybe } from '../lib/dom';

/** Makes the hero content visible without animation. Also used as the failure path. */
export function revealHero(): void {
  gsap.set('.nav > *, .coord, .cue, #introText', { opacity: 1 });
  gsap.set('#name, #eyebrow', { visibility: 'visible' });
  const eyebrow = maybe('#eyebrow');
  const role = eyebrow?.dataset['role'];
  if (eyebrow !== null && role !== undefined) eyebrow.textContent = role;
}

export function initHero(reduced: boolean): void {
  const eyebrow = maybe('#eyebrow');
  const name = maybe('#name');
  if (eyebrow === null || name === null) return;
  const role = eyebrow.dataset['role'] ?? eyebrow.textContent ?? '';

  if (reduced) {
    revealHero();
    return;
  }

  eyebrow.textContent = '';
  const split = new SplitType(name, { types: 'words,chars' });
  gsap.set([name, eyebrow], { visibility: 'visible' });

  const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
  if (split.chars !== null)
    intro.from(split.chars, { yPercent: 115, duration: 1.3, stagger: 0.07 }, 0.1);
  intro
    .to('.nav > *', { opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' }, 0.6)
    .to('.coord, .cue', { opacity: 1, duration: 1, ease: 'power2.out' }, 1.6);

  // Typed "WELCOME", then it morphs into the role line.
  const word = 'WELCOME';
  const typed = gsap.timeline({ delay: 0.5 });
  Array.from(word).forEach((_, i) => {
    typed.to(eyebrow, { duration: 0.08, text: word.slice(0, i + 1), ease: 'none' }, '+=0.08');
  });
  typed.to(eyebrow, { duration: 1.6, text: role, ease: 'power2.inOut' }, '+=0.4');

  const paragraph = new SplitType('#introText', { types: 'lines' });
  gsap.set('#introText', { opacity: 1 });
  if (paragraph.lines !== null) {
    gsap.fromTo(
      paragraph.lines,
      { y: 25, opacity: 0, force3D: true },
      { y: 0, opacity: 1, ease: 'power1.out', duration: 0.75, delay: 2.4, stagger: 0.1 },
    );
  }
}
