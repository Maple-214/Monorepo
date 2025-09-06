import { requestInterceptors, responseInterceptors } from './interceptors';
import type { RequestOptions, SDKError } from './types';

// ---------- 缓存实现 ----------
interface CacheEntry {
  data: unknown;
  expireAt: number;
}
const cache = new Map<string, CacheEntry>();

export function _getCache<T>(key: string): T | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (entry.expireAt > Date.now()) return entry.data as T;
  cache.delete(key);
  return undefined;
}
export function _setCache<T>(key: string, data: T, ttl: number) {
  cache.set(key, { data, expireAt: Date.now() + ttl });
}
export function _clearCache(key?: string) {
  if (key) cache.delete(key);
  else cache.clear();
}

// ---------- inflight 去重 ----------
const inflight = new Map<string, Promise<unknown>>();

// ---------- 工具：延时 ----------
function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

// ---------- 主请求函数 ----------
export async function request<T = unknown>(
  inputUrl: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    cacheTime = 0,
    method = 'GET',
    timeout,
    retry = 0,
    retryDelay = 300,
    dedupe = true,
  } = options;

  const dedupeKey =
    options.dedupeKey ?? `${method}:${inputUrl}:${JSON.stringify(options.body ?? {})}`;

  // 缓存逻辑
  if (cacheTime > 0 && !options.forceRefresh) {
    const cached = _getCache<T>(dedupeKey);
    if (cached !== undefined) return cached;
  }

  // 去重
  if (dedupe && inflight.has(dedupeKey)) {
    return inflight.get(dedupeKey)! as Promise<T>;
  }

  // 应用请求拦截器（可能修改 url/options）
  let finalUrl = inputUrl;
  let finalOpts: RequestOptions = { ...options, method };

  for (const interceptor of requestInterceptors.getHandlers()) {
    const res = await interceptor(finalUrl, finalOpts);
    finalUrl = res[0];
    finalOpts = res[1];
  }

  // retry loop
  let attempts = 0;
  const maxAttempts = Math.max(1, retry + 1);
  const doFetch = async (): Promise<T> => {
    attempts++;
    let controller: AbortController | undefined;
    let signal = finalOpts.signal;
    if (typeof timeout === 'number' && timeout > 0) {
      controller = new AbortController();
      signal = controller.signal;
      const timer = setTimeout(() => controller?.abort(), timeout);
      if (typeof (timer as any).unref === 'function') {
        (timer as any).unref();
      }
    }

    try {
      const res = await fetch(finalUrl, { ...finalOpts, signal } as RequestInit);

      // 尝试解析 JSON（若不是 JSON 则捕获）
      let parsed: unknown = undefined;
      try {
        parsed = await res.clone().json();
      } catch {
        // not json, we still proceed. parsed remains undefined.
      }

      // 运行响应拦截器（插件可以在这里进行 token 刷新并返回新的数据）
      let finalData: unknown = parsed;
      for (const rInter of responseInterceptors.getHandlers()) {
        finalData = await rInter(finalData, finalUrl, finalOpts);
      }

      if (!res.ok) {
        const err: SDKError = new Error(`Request failed with status ${res.status}`) as SDKError;
        err.status = res.status;
        err.url = finalUrl;
        err.data = finalData;
        throw err;
      }

      // 缓存
      if (cacheTime > 0) _setCache<T>(dedupeKey, finalData as T, cacheTime);

      return finalData as T;
    } catch (err) {
      // 网络错误或解析错误
      if (attempts < maxAttempts) {
        // exponential backoff
        const wait = retryDelay * Math.pow(2, attempts - 1);
        await sleep(wait);
        return doFetch();
      }
      throw err;
    } finally {
      // inflight 清理在外层完成
    }
  };

  const running = (async () => {
    try {
      const result = await doFetch();
      return result;
    } finally {
      inflight.delete(dedupeKey);
    }
  })();

  inflight.set(dedupeKey, running as Promise<unknown>);
  return running as Promise<T>;
}

// ---------- 快捷方法 ----------
export const http = {
  get: <T = unknown>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'GET' }),
  post: <T = unknown>(url: string, body?: unknown, options?: RequestOptions) =>
    request<T>(url, {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
      body: typeof body === 'string' ? body : JSON.stringify(body ?? {}),
    }),
  put: <T = unknown>(url: string, body?: unknown, options?: RequestOptions) =>
    request<T>(url, {
      ...options,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
      body: typeof body === 'string' ? body : JSON.stringify(body ?? {}),
    }),
  delete: <T = unknown>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'DELETE' }),
};
