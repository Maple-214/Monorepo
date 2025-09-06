import { describe, it, vi } from 'vitest';
import { request } from '../src/core';
import { setupLoggerPlugin } from '../src/plugins/logger';

describe('logger plugin', () => {
  it('should log request and response', async () => {
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    setupLoggerPlugin();

    vi.spyOn(global, 'fetch' as any).mockResolvedValue({
      ok: true,
      json: async () => ({ logged: true }),
      clone: function () {
        return this;
      },
    } as Response);

    await request('/log-test');
    expect(debugSpy).toHaveBeenCalled();
  });
});
