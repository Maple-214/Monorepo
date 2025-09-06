import { describe, it, expect, vi, beforeEach } from 'vitest';
import { request, requestInterceptors, responseInterceptors } from '../src/index';
import { setupAuthPlugin } from '../src/plugins/auth';

describe('auth plugin', () => {
  beforeEach(() => {
    requestInterceptors.getHandlers().length = 0;
    responseInterceptors.getHandlers().length = 0;
    localStorage.clear();
  });

  it('should add Authorization header if token exists', async () => {
    localStorage.setItem('token', 'fake-token');
    setupAuthPlugin(async () => 'new-token');

    const mockResponse = {
      ok: true,
      json: async () => ({ success: true }),
      clone: function () {
        return this;
      },
    };

    const fetchMock = vi.spyOn(global, 'fetch' as any).mockResolvedValue(mockResponse as Response);

    const result = await request<{ success: boolean }>('/test');
    expect(fetchMock).toHaveBeenCalledWith(
      '/test',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer fake-token',
        }),
      }),
    );
    expect(result).toEqual({ success: true });
  });
});
