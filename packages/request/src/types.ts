export type CacheStrategy = 'no-cache' | 'cache-first' | 'network-first' | 'stale-while-revalidate';

export interface RequestOptions extends RequestInit {
  baseURL?: string;
  timeout?: number;
  cacheKey?: string;
  cacheTime?: number;
  cacheStrategy?: CacheStrategy;
  forceRefresh?: boolean;
  dedupe?: boolean;
  retry?: number;
  retryDelay?: number;
}

export type RequestInterceptor = (
  url: string,
  options: RequestOptions,
) => Promise<[string, RequestOptions]> | [string, RequestOptions];

export type ResponseInterceptor<T = unknown> = (
  response: T,
  url: string,
  options: RequestOptions,
) => Promise<T> | T;
