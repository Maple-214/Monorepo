// packages/sdk/src/core.ts

export interface RequestOptions extends RequestInit {
  cacheTime?: number; // 缓存时间，毫秒，默认 0 = 不缓存
  dedupeKey?: string; // 请求去重 key，默认 url+method+body
}

export interface SDKError extends Error {
  status?: number;
  url?: string;
}

// ------------------ 缓存 ------------------
interface CacheEntry<T> {
  data: T;
  expireAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCache<T>(key: string): T | undefined {
  const entry = cache.get(key);
  if (entry && entry.expireAt > Date.now()) {
    return entry.data as T;
  }
  cache.delete(key);
  return undefined;
}

function setCache<T>(key: string, data: T, ttl: number) {
  cache.set(key, { data, expireAt: Date.now() + ttl });
}

// ------------------ 请求去重 ------------------
const inflight = new Map<string, Promise<unknown>>();

// ------------------ 拦截器 ------------------
type RequestInterceptor = (
  url: string,
  options: RequestOptions,
) => Promise<[string, RequestOptions]> | [string, RequestOptions];

type ResponseInterceptor<T> = (response: T, url: string, options: RequestOptions) => Promise<T> | T;

class InterceptorManager<T> {
  private handlers: Array<T> = [];
  use(handler: T) {
    this.handlers.push(handler);
  }
  getHandlers() {
    return this.handlers;
  }
}

export const requestInterceptors = new InterceptorManager<RequestInterceptor>();
export const responseInterceptors = new InterceptorManager<ResponseInterceptor<unknown>>();

// ------------------ 主请求方法 ------------------
export async function request<T = unknown>(url: string, options: RequestOptions = {}): Promise<T> {
  const { cacheTime = 0, method = 'GET' } = options;

  const dedupeKey = options.dedupeKey || `${method}:${url}:${JSON.stringify(options.body || {})}`;

  // 缓存
  if (cacheTime > 0) {
    const cached = getCache<T>(dedupeKey);
    if (cached) return cached;
  }

  // 请求去重
  if (inflight.has(dedupeKey)) {
    return inflight.get(dedupeKey)! as Promise<T>;
  }

  // 应用请求拦截器
  let finalUrl = url;
  let finalOpts: RequestOptions = { ...options };
  for (const interceptor of requestInterceptors.getHandlers()) {
    [finalUrl, finalOpts] = await interceptor(finalUrl, finalOpts);
  }

  const fetchPromise = (async () => {
    try {
      const res = await fetch(finalUrl, finalOpts);

      if (!res.ok) {
        const error: SDKError = new Error(`Request failed with status ${res.status}`);
        error.status = res.status;
        error.url = finalUrl;
        throw error;
      }

      const data = (await res.json()) as T;

      // 应用响应拦截器
      let finalData = data as T;
      for (const interceptor of responseInterceptors.getHandlers()) {
        finalData = (await interceptor(finalData, finalUrl, finalOpts)) as T;
      }

      if (cacheTime > 0) setCache(dedupeKey, finalData, cacheTime);

      return finalData;
    } finally {
      inflight.delete(dedupeKey);
    }
  })();

  inflight.set(dedupeKey, fetchPromise);

  return fetchPromise as Promise<T>;
}

// ------------------ 快捷方法 ------------------
export const http = {
  get: <T = unknown>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'GET' }),
  post: <T = unknown>(url: string, body?: unknown, options?: RequestOptions) =>
    request<T>(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      body: JSON.stringify(body),
    }),
  put: <T = unknown>(url: string, body?: unknown, options?: RequestOptions) =>
    request<T>(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      body: JSON.stringify(body),
    }),
  delete: <T = unknown>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'DELETE' }),
};

// ------------------ OOP HttpClient ------------------
export class HttpClient {
  constructor(private baseUrl: string = '') {}

  get<T = unknown>(path: string, options?: RequestOptions) {
    return http.get<T>(this.baseUrl + path, options);
  }

  post<T = unknown>(path: string, body?: unknown, options?: RequestOptions) {
    return http.post<T>(this.baseUrl + path, body, options);
  }

  put<T = unknown>(path: string, body?: unknown, options?: RequestOptions) {
    return http.put<T>(this.baseUrl + path, body, options);
  }

  delete<T = unknown>(path: string, options?: RequestOptions) {
    return http.delete<T>(this.baseUrl + path, options);
  }
}
