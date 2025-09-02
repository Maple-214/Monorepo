import { requestInterceptors, responseInterceptors } from '../core';
import type { RequestOptions } from '../core';

/**
 * 日志插件：打印请求 & 响应
 */
export function setupLoggerPlugin() {
  // 请求日志
  requestInterceptors.use((url: string, options: RequestOptions) => {
    console.log(
      `[SDK][Request] ${options.method || 'GET'} ${url}`,
      options.body ? `\nBody: ${JSON.stringify(options.body)}` : '',
    );
    return [url, options];
  });

  // 响应日志
  responseInterceptors.use((res, url, options) => {
    console.log(`[SDK][Response] ${options.method || 'GET'} ${url}`, '\nResponse:', res);
    return res;
  });
}
