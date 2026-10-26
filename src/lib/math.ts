export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Opacity of a gallery card by its distance (in cards) from the current position. */
export function cardOpacity(distance: number, reach = 2.4, falloff = 1.6): number {
  const d = Math.abs(distance);
  if (d > reach) return 0;
  return Math.max(0, 1 - Math.pow(d / reach, falloff));
}

/**
 * Horizontal mask offset (percent) for the project title wipe.
 * Fully revealed (+-100, off the text) when resting on a project, covering (0) halfway between two.
 */
export function titleMaskOffset(position: number, index: number): number {
  const delta = position - index;
  const hidden = 1 - clamp((0.5 - Math.abs(delta)) / 0.35, 0, 1);
  return (delta < 0 ? 1 : -1) * (1 - hidden) * 100;
}

/** Scroll progress (0..1) for a project index in a gallery of `count` items. */
export function progressForIndex(index: number, count: number): number {
  if (count <= 1) return 0;
  return clamp(index, 0, count - 1) / (count - 1);
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}
