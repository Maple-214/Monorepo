// 缓存策略
export type CacheStrategy = 'no-cache' | 'cache-first' | 'network-first' | 'stale-while-revalidate';

// 请求选项
export interface RequestOptions extends Omit<RequestInit, 'body'> {
  baseURL?: string;
  timeout?: number; // ms
  cacheKey?: string;
  cacheTime?: number; // ms, 0 = no cache
  cacheStrategy?: CacheStrategy;
  forceRefresh?: boolean;
  dedupe?: boolean;
  retry?: number; // 重试次数
  retryDelay?: number; // 初始重试延迟 ms
  dedupeKey?: string; // 强制去重键
  method?: string;
  body?: any;
}

// 请求拦截器
export type RequestInterceptor = (
  url: string,
  options: RequestOptions,
) => Promise<[string, RequestOptions]> | [string, RequestOptions];

// 响应拦截器
export type ResponseInterceptor<T = unknown> = (
  response: T,
  url: string,
  options: RequestOptions,
) => Promise<T> | T;

// 重试配置
export interface RetryOptions {
  retries?: number; // 最大重试次数
  delay?: number; // 初始延迟 (ms)
  factor?: number; // 延迟增长因子
  shouldRetry?: (error: unknown) => boolean; // 判断是否重试
  onRetry?: (error: unknown, attempt: number) => void; // 每次重试回调
}

// SDK 错误
export interface SDKError extends Error {
  status?: number;
  url?: string;
  data?: unknown;
}
