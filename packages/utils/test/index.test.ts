import { describe, it, expect } from 'vitest';
import { clamp, format_currency } from '../src';

describe('utils', () => {
  it('clamp works', () => {
    expect(clamp(10, 0, 5)).toBe(5);
  });
  it('format_currency works', () => {
    expect(format_currency(12.3, 'USD', 'en-US')).toContain('$');
  });
});
