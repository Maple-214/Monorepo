import { describe, it, expect, vi } from 'vitest';
import { request } from '../src/core';

describe('cache', () => {
  it('should cache response within cacheTime', async () => {
    const fetchMock = vi.spyOn(global, 'fetch' as any).mockResolvedValue({
      ok: true,
      json: async () => ({ cached: true }),
      clone: function () {
        return this;
      },
    } as Response);

    const first = await request<{ cached: boolean }>('/cache-test', {
      cacheTime: 1000,
      dedupe: false,
    });
    const second = await request<{ cached: boolean }>('/cache-test', {
      cacheTime: 1000,
      dedupe: false,
    });

    expect(first).toEqual(second);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
