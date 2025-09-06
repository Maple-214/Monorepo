import { requestInterceptors, responseInterceptors } from '../interceptors';
import type { RequestOptions } from '../types';

export function setupLoggerPlugin(opts?: { level?: 'info' | 'debug' | 'warn' | 'error' }) {
  const level = opts?.level ?? 'info';
  requestInterceptors.use(async (url: string, options: RequestOptions) => {
    if (level === 'debug' || level === 'info') {
      console.debug(`[request] ${options.method ?? 'GET'} ${url}`);
    }
    return [url, options];
  });

  responseInterceptors.use(async (res: unknown, url: string) => {
    if (level === 'debug') {
      console.debug(`[response] ${url}`, res);
    }
    return res;
  });
}
