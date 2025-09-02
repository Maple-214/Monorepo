import { requestInterceptors, responseInterceptors } from '../core';
import type { RequestOptions } from '../core';

let refreshing = false;

export function setupAuthPlugin(refreshFn: () => Promise<string>) {
  // 请求拦截：自动加 token
  requestInterceptors.use(async (url, options) => {
    const token = localStorage.getItem('token');
    return [
      url,
      {
        ...options,
        headers: {
          ...options.headers,
          Authorization: token ? `Bearer ${token}` : '',
        },
      },
    ];
  });

  // 响应拦截：处理 401
  responseInterceptors.use(async (res: unknown, url: string, options: RequestOptions) => {
    // ⚠️ 注意这里强转
    const data = res as { code?: number };

    if (data?.code === 401 && !refreshing) {
      refreshing = true;
      const newToken = await refreshFn();
      localStorage.setItem('token', newToken);
      refreshing = false;

      // 重试请求
      const retryRes = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        },
      });
      return retryRes.json();
    }

    return res;
  });
}
