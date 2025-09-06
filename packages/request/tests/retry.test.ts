import { describe, it, expect, vi } from 'vitest';
import { retry } from '../src/plugins/retry';

describe('retry plugin', () => {
  it('should retry and succeed', async () => {
    let attempts = 0;
    const fn = vi.fn(async () => {
      attempts++;
      if (attempts < 2) throw new Error('fail');
      return 'success';
    });

    const result = await retry(fn, { retries: 3, delay: 10 });
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
