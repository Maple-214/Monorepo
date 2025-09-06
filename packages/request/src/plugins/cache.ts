import { _getCache, _setCache, _clearCache } from '../core';

/**
 * 暴露缓存操作，供外部手动清理或读取
 */
export const cacheAPI = {
  get: <T = unknown>(key: string) => _getCache<T>(key),
  set: <T = unknown>(key: string, data: T, ttl: number) => _setCache<T>(key, data, ttl),
  clear: (key?: string) => _clearCache(key),
};

export default cacheAPI;
