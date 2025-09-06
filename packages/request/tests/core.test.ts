import { describe, it, expect, vi } from 'vitest';
import { http } from '../src/core';

describe('core request', () => {
  it('should perform a GET request', async () => {
    // Mock fetch with a full response object
    const mockResponse = {
      ok: true,
      json: async () => ({ hello: 'world' }),
      clone: function () {
        return this;
      },
    };

    global.fetch = vi.fn().mockResolvedValue(mockResponse as any);

    const res = await http.get<{ hello: string }>('/api/test');
    expect(res).toEqual({ hello: 'world' });
  });

  it('should throw on non-200 response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      clone: function () {
        return this;
      },
      json: async () => ({}),
    }) as any;

    await expect(http.get('/api/error')).rejects.toThrow('Request failed');
  });
});
