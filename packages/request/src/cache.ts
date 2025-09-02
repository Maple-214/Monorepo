interface CacheItem<T = unknown> {
  expire: number;
  data: T;
}

const memoryCache = new Map<string, CacheItem>();

export function getCache<T>(key: string): T | null {
  const cached = memoryCache.get(key);
  if (cached && cached.expire > Date.now()) {
    return cached.data as T;
  }
  return null;
}

export function setCache<T>(key: string, data: T, ttl: number): void {
  memoryCache.set(key, {
    expire: Date.now() + ttl,
    data,
  });
}
