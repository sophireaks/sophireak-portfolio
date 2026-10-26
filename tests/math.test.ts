import { describe, expect, it } from 'vitest';
import { cardOpacity, clamp, pad2, progressForIndex, titleMaskOffset } from '../src/lib/math';

describe('clamp', () => {
  it('limits values to the range', () => {
    expect(clamp(5, 0, 3)).toBe(3);
    expect(clamp(-1, 0, 3)).toBe(0);
    expect(clamp(2, 0, 3)).toBe(2);
  });
});

describe('cardOpacity', () => {
  it('is fully opaque at the center and hidden beyond reach', () => {
    expect(cardOpacity(0)).toBe(1);
    expect(cardOpacity(2.5)).toBe(0);
    expect(cardOpacity(-2.5)).toBe(0);
  });
  it('is symmetric and decreasing with distance', () => {
    expect(cardOpacity(1)).toBeCloseTo(cardOpacity(-1));
    expect(cardOpacity(0.5)).toBeGreaterThan(cardOpacity(1));
    expect(cardOpacity(1)).toBeGreaterThan(cardOpacity(2));
  });
});

describe('titleMaskOffset', () => {
  it('moves the mask fully off the title while resting on a project', () => {
    expect(Math.abs(titleMaskOffset(3, 3))).toBe(100);
    expect(Math.abs(titleMaskOffset(3.1, 3))).toBe(100);
  });
  it('covers the title halfway between two projects', () => {
    expect(titleMaskOffset(2.5, 3)).toBeCloseTo(0);
    expect(titleMaskOffset(3.5, 3)).toBeCloseTo(0);
  });
  it('enters from the right before a project and from the left after it', () => {
    expect(titleMaskOffset(2.9, 3)).toBeGreaterThan(0);
    expect(titleMaskOffset(3.4, 3)).toBeLessThan(0);
  });
});

describe('progressForIndex', () => {
  it('maps indices onto 0..1', () => {
    expect(progressForIndex(0, 6)).toBe(0);
    expect(progressForIndex(5, 6)).toBe(1);
    expect(progressForIndex(2, 6)).toBeCloseTo(0.4);
  });
  it('clamps out of range indices and handles a single item', () => {
    expect(progressForIndex(-3, 6)).toBe(0);
    expect(progressForIndex(99, 6)).toBe(1);
    expect(progressForIndex(0, 1)).toBe(0);
  });
});

describe('pad2', () => {
  it('pads to two digits', () => {
    expect(pad2(3)).toBe('03');
    expect(pad2(12)).toBe('12');
  });
});
