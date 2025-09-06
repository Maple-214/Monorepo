import { requestInterceptors, responseInterceptors } from '../interceptors';

let refreshing = false;

export function setupAuthPlugin(refreshFn: () => Promise<string>) {
  // 请求拦截：加 token
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
  responseInterceptors.use(async (res: any, url, options) => {
    if (res?.code === 401 && !refreshing) {
      refreshing = true;
      const newToken = await refreshFn();
      localStorage.setItem('token', newToken);
      refreshing = false;

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
