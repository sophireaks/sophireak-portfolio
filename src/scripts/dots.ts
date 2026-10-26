import { gsap } from 'gsap';
import { maybe } from '../lib/dom';

/** Dot grid that reacts to the cursor. Pauses when the hero is off screen. */
export function initDots(): void {
  const canvas = maybe<HTMLCanvasElement>('#dots');
  const ctx = canvas?.getContext('2d') ?? null;
  if (canvas === null || ctx === null) return;

  const gap = 30;
  const reach = 150;
  let width = 0;
  let height = 0;
  let mx = -9999;
  let my = -9999;
  let visible = true;
  let frame = 0;
  let color = '#888';
  const styles = getComputedStyle(document.documentElement);

  function resize(): void {
    if (canvas === null || ctx === null) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mx = e.clientX - rect.left;
    my = e.clientY - rect.top;
  });
  new IntersectionObserver((entries) => {
    visible = entries[0]?.isIntersecting ?? true;
  }).observe(canvas);

  gsap.ticker.add((time) => {
    if (!visible) return;
    if (frame++ % 5 === 0) color = styles.getPropertyValue('--muted').trim() || color;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.55;
    for (let gx = gap / 2; gx < width; gx += gap) {
      for (let gy = gap / 2; gy < height; gy += gap) {
        const dx = gx - mx;
        const dy = gy - my;
        const dist = Math.hypot(dx, dy);
        let px = gx;
        let py = gy + Math.sin(time * 0.9 + gx * 0.012) * 1.4;
        let r = 1;
        if (dist < reach) {
          const f = Math.pow(1 - dist / reach, 2);
          px += (dx / (dist || 1)) * f * 22;
          py += (dy / (dist || 1)) * f * 22;
          r = 1 + f * 2.6;
        }
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
}
