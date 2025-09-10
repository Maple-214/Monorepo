import React, { useState, useEffect, useCallback, useRef } from 'react';

// 定义统一的缓存统计接口
interface CacheStats {
  count: number;
  totalSize: number;
  totalHits?: number; // CDN特有的可选属性
}

// 内存缓存类
class MemoryCache {
  private cache: Map<string, { response: unknown; timestamp: number; size: number }>;
  private maxSize: number;
  private defaultTTL: number;

  constructor(maxSize: number = 50, defaultTTL: number = 300000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }

  get<T>(key: string): { data: T | null; fromCache: boolean } {
    const item = this.cache.get(key);
    if (!item) return { data: null, fromCache: false };

    if (Date.now() - item.timestamp > this.defaultTTL) {
      this.cache.delete(key);
      return { data: null, fromCache: false };
    }
    return { data: item.response as T, fromCache: true };
  }

  set(key: string, response: unknown, size: number = 1): void {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }
    this.cache.set(key, { response, timestamp: Date.now(), size });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  getEntries(): [string, unknown][] {
    return Array.from(this.cache.entries());
  }

  getTotalSize(): number {
    let total = 0;
    this.cache.forEach((item) => {
      total += item.size;
    });
    return total;
  }

  getStats(): CacheStats {
    return {
      count: this.size(),
      totalSize: this.getTotalSize(),
    };
  }
}

// Service Worker 模拟类
class ServiceWorkerCache {
  private cachedResources: Map<string, { timestamp: number; size: number }> = new Map();

  async precache(resources: string[]): Promise<void> {
    for (const resource of resources) {
      this.cachedResources.set(resource, {
        timestamp: Date.now(),
        size: Math.floor(Math.random() * 5) + 1,
      });
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  async match(request: string): Promise<{ cached: boolean; size: number }> {
    const cached = this.cachedResources.get(request);
    if (cached) {
      return { cached: true, size: cached.size };
    }
    return { cached: false, size: 0 };
  }

  clear(): void {
    this.cachedResources.clear();
  }

  getStats(): CacheStats {
    let totalSize = 0;
    this.cachedResources.forEach((resource) => {
      totalSize += resource.size;
    });
    return {
      count: this.cachedResources.size,
      totalSize,
    };
  }
}

// 磁盘缓存模拟
class DiskCache {
  private storage: Map<string, { timestamp: number; size: number }> = new Map();

  store(key: string, size: number = 10): void {
    this.storage.set(key, { timestamp: Date.now(), size });
  }

  retrieve(key: string): { exists: boolean; size: number } {
    const item = this.storage.get(key);
    return item ? { exists: true, size: item.size } : { exists: false, size: 0 };
  }

  clear(): void {
    this.storage.clear();
  }

  getStats(): CacheStats {
    let totalSize = 0;
    this.storage.forEach((item) => {
      totalSize += item.size;
    });
    return {
      count: this.storage.size,
      totalSize,
    };
  }
}

// CDN 模拟
class CDNCache {
  private edgeNodes: Map<string, { hits: number; size: number }> = new Map();

  cacheResource(url: string, size: number = 20): void {
    this.edgeNodes.set(url, { hits: 0, size });
  }

  getResource(url: string): { served: boolean; hit: boolean; size: number } {
    const resource = this.edgeNodes.get(url);
    if (resource) {
      resource.hits += 1;
      return { served: true, hit: true, size: resource.size };
    }
    return { served: false, hit: false, size: 0 };
  }

  clear(): void {
    this.edgeNodes.clear();
  }

  getStats(): CacheStats {
    let totalSize = 0;
    let totalHits = 0;
    this.edgeNodes.forEach((resource) => {
      totalSize += resource.size;
      totalHits += resource.hits;
    });
    return {
      count: this.edgeNodes.size,
      totalSize,
      totalHits,
    };
  }
}

// 创建缓存实例
const memoryCache = new MemoryCache();
const swCache = new ServiceWorkerCache();
const diskCache = new DiskCache();
const cdnCache = new CDNCache();

// 定义组件状态接口
interface CacheStatsState {
  memory: CacheStats;
  sw: CacheStats;
  disk: CacheStats;
  cdn: CacheStats & { totalHits: number };
}

export const AdvancedCacheDemo: React.FC = () => {
  const [cacheStatus, setCacheStatus] = useState<string>('系统初始化中...');
  const [loadTime, setLoadTime] = useState<number>(0);
  const [requests, setRequests] = useState<number>(0);
  const [hits, setHits] = useState<number>(0);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [predictedResources, setPredictedResources] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [cacheStats, setCacheStats] = useState<CacheStatsState>({
    memory: { count: 0, totalSize: 0 },
    sw: { count: 0, totalSize: 0 },
    disk: { count: 0, totalSize: 0 },
    cdn: { count: 0, totalSize: 0, totalHits: 0 },
  });
  const [requestLog, setRequestLog] = useState<
    Array<{
      url: string;
      time: number;
      from: string;
      success: boolean;
    }>
  >([]);

  const requestCounter = useRef(0);

  // 预测性预加载配置
  const predictiveConfig: Record<string, string[]> = {
    dashboard: [
      '/api/user/stats',
      '/api/notifications',
      '/static/dashboard-widget.js',
      '/images/header-bg.jpg',
    ],
    products: [
      '/api/products/popular',
      '/api/categories',
      '/static/product-grid.css',
      '/images/products/thumbnails/',
    ],
    profile: [
      '/api/user/profile',
      '/api/user/preferences',
      '/static/avatar-upload.js',
      '/images/avatars/',
    ],
  };

  // 初始化CDN资源
  useEffect(() => {
    cdnCache.cacheResource('/static/react.production.min.js', 15);
    cdnCache.cacheResource('/static/tailwind.min.css', 8);
    cdnCache.cacheResource('/images/logo.svg', 2);
    cdnCache.cacheResource('/fonts/inter.woff2', 25);
    updateAllStats();
  }, []);

  // 更新所有缓存统计
  const updateAllStats = useCallback(() => {
    setCacheStats({
      memory: memoryCache.getStats(),
      sw: swCache.getStats(),
      disk: diskCache.getStats(),
      cdn: cdnCache.getStats() as CacheStats & { totalHits: number },
    });
  }, []);

  // 模拟数据加载 - 四级缓存策略
  const loadDataWithCache = useCallback(
    async (url: string, isPredictive: boolean = false) => {
      const startTime = performance.now();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const requestId = ++requestCounter.current;
      setRequests((prev) => prev + 1);
      setLoadingStates((prev) => ({ ...prev, [url]: true }));

      let cacheSource = 'miss';
      let success = true;

      try {
        // 1. 检查内存缓存
        const memoryResult = memoryCache.get(url);
        if (memoryResult.fromCache) {
          setHits((prev) => prev + 1);
          cacheSource = 'memory';
          logRequest(url, performance.now() - startTime, 'memory', true);
          return memoryResult.data;
        }

        // 2. 检查Service Worker缓存
        const swResult = await swCache.match(url);
        if (swResult.cached) {
          setHits((prev) => prev + 1);
          memoryCache.set(url, { data: `cached_${url}` }, swResult.size);
          cacheSource = 'serviceworker';
          logRequest(url, performance.now() - startTime, 'serviceworker', true);
          return { data: `cached_${url}` };
        }

        // 3. 检查磁盘缓存
        const diskResult = diskCache.retrieve(url);
        if (diskResult.exists) {
          setHits((prev) => prev + 1);
          swCache.precache([url]);
          memoryCache.set(url, { data: `disk_${url}` }, diskResult.size);
          cacheSource = 'disk';
          logRequest(url, performance.now() - startTime, 'disk', true);
          return { data: `disk_${url}` };
        }

        // 4. 检查CDN
        const cdnResult = cdnCache.getResource(url);
        if (cdnResult.served) {
          setHits((prev) => prev + 1);
          memoryCache.set(url, { data: `cdn_${url}` }, cdnResult.size);
          swCache.precache([url]);
          diskCache.store(url, cdnResult.size);
          cacheSource = 'cdn';
          logRequest(url, performance.now() - startTime, 'cdn', true);
          return { data: `cdn_${url}` };
        }

        // 5. 回源到服务器
        await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400));

        const responseSize = Math.floor(Math.random() * 10) + 5;
        const responseData = { data: `server_${url}`, timestamp: Date.now() };

        memoryCache.set(url, responseData, 1);
        swCache.precache([url]);
        diskCache.store(url, responseSize);
        cdnCache.cacheResource(url, responseSize);

        cacheSource = 'server';
        logRequest(url, performance.now() - startTime, 'server', true);
        return responseData;
      } catch (error) {
        console.error('请求失败:', error);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        success = false;
        logRequest(url, performance.now() - startTime, 'error', false);
        throw error;
      } finally {
        const timeTaken = performance.now() - startTime;
        setLoadTime(timeTaken);
        setLoadingStates((prev) => ({ ...prev, [url]: false }));

        if (!isPredictive) {
          setCacheStatus(`请求完成: ${url} → 来源: ${cacheSource} (${timeTaken.toFixed(0)}ms)`);
        }

        updateAllStats();
      }
    },
    [updateAllStats],
  );

  // 记录请求日志
  const logRequest = (url: string, time: number, from: string, success: boolean) => {
    setRequestLog((prev) => [{ url, time, from, success }, ...prev.slice(0, 9)]);
  };

  // 触发预测性预加载
  const triggerPredictivePrecache = useCallback(
    async (view: string) => {
      const resources = predictiveConfig[view] || [];
      setPredictedResources(resources);
      setCacheStatus(`开始预测性预加载: ${resources.length}个资源`);

      for (const resource of resources) {
        setLoadingStates((prev) => ({ ...prev, [resource]: true }));
        try {
          await loadDataWithCache(resource, true);
        } catch (error) {
          console.warn(`预加载失败: ${resource}`, error);
        } finally {
          setLoadingStates((prev) => ({ ...prev, [resource]: false }));
        }
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      setCacheStatus(`预测性预加载完成: ${view}视图`);
    },
    [loadDataWithCache],
  );

  // 清除所有缓存
  const clearAllCache = useCallback(async () => {
    memoryCache.clear();
    swCache.clear();
    diskCache.clear();
    cdnCache.clear();

    setRequests(0);
    setHits(0);
    setRequestLog([]);
    setCacheStatus('所有缓存已清除');
    updateAllStats();
  }, [updateAllStats]);

  // 手动测试缓存
  const testCacheLevel = useCallback(
    async (level: string) => {
      const testUrl = `/api/test/${level}/${Date.now()}`;
      setCacheStatus(`测试${level}缓存...`);

      if (level === 'memory') {
        memoryCache.set(testUrl, { test: 'memory_data' }, 2);
      } else if (level === 'serviceworker') {
        await swCache.precache([testUrl]);
      } else if (level === 'disk') {
        diskCache.store(testUrl, 5);
      } else if (level === 'cdn') {
        cdnCache.cacheResource(testUrl, 8);
      }

      await loadDataWithCache(testUrl);
    },
    [loadDataWithCache],
  );

  // 计算命中率
  const hitRate = requests > 0 ? (hits / requests) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 头部 */}
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            🏢 四级缓存架构
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">实时演示：预测性预加载 + 智能缓存管理</p>
        </header>

        {/* 四级缓存架构可视化 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">🏗️ 四级缓存架构可视化</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Memory Cache */}
            <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-blue-700">1. Memory Cache</h3>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {cacheStats.memory.count}项
                </span>
              </div>
              <div className="text-sm text-blue-600 space-y-1">
                <div>超快速 · 会话级</div>
                <div>大小: {cacheStats.memory.totalSize}KB</div>
                <div>命中: {requestLog.filter((r) => r.from === 'memory').length}</div>
              </div>
              <button
                onClick={() => testCacheLevel('memory')}
                className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded"
              >
                测试内存缓存
              </button>
            </div>

            {/* Service Worker */}
            <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-purple-700">2. Service Worker</h3>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                  {cacheStats.sw.count}项
                </span>
              </div>
              <div className="text-sm text-purple-600 space-y-1">
                <div>智能拦截 · 策略管理</div>
                <div>大小: {cacheStats.sw.totalSize}KB</div>
                <div>命中: {requestLog.filter((r) => r.from === 'serviceworker').length}</div>
              </div>
              <button
                onClick={() => testCacheLevel('serviceworker')}
                className="mt-3 w-full bg-purple-500 hover:bg-purple-600 text-white text-sm py-1 px-3 rounded"
              >
                测试SW缓存
              </button>
            </div>

            {/* Disk Cache */}
            <div className="bg-green-50 rounded-xl p-4 border-2 border-green-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-green-700">3. Disk Cache</h3>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  {cacheStats.disk.count}项
                </span>
              </div>
              <div className="text-sm text-green-600 space-y-1">
                <div>大容量 · 持久化</div>
                <div>大小: {cacheStats.disk.totalSize}KB</div>
                <div>命中: {requestLog.filter((r) => r.from === 'disk').length}</div>
              </div>
              <button
                onClick={() => testCacheLevel('disk')}
                className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white text-sm py-1 px-3 rounded"
              >
                测试磁盘缓存
              </button>
            </div>

            {/* CDN */}
            <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-orange-700">4. CDN Edge</h3>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                  {cacheStats.cdn.count}项
                </span>
              </div>
              <div className="text-sm text-orange-600 space-y-1">
                <div>全球分发 · 就近访问</div>
                <div>大小: {cacheStats.cdn.totalSize}KB</div>
                <div>命中: {cacheStats.cdn.totalHits}次</div>
              </div>
              <button
                onClick={() => testCacheLevel('cdn')}
                className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white text-sm py-1 px-3 rounded"
              >
                测试CDN缓存
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* 实时性能监控面板 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">📊 实时性能监控面板</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">缓存命中率</div>
                <div className="text-3xl font-bold text-green-600">{hitRate.toFixed(1)}%</div>
                <div className="text-xs text-gray-500">
                  {hits} / {requests} 请求
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">平均加载时间</div>
                <div className="text-3xl font-bold text-blue-600">{loadTime.toFixed(0)}ms</div>
                <div className="text-xs text-gray-500">最后一次请求</div>
              </div>
            </div>

            {/* 请求日志 */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-700 mb-3">实时请求日志</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {requestLog.map((log, index) => (
                  <div
                    key={index}
                    className={`text-sm p-2 rounded ${
                      log.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{log.url.split('/').pop()}</span>
                      <span>{log.time.toFixed(0)}ms</span>
                    </div>
                    <div className="text-xs opacity-75">来自: {log.from}</div>
                  </div>
                ))}
                {requestLog.length === 0 && (
                  <div className="text-gray-500 text-sm text-center py-4">暂无请求记录</div>
                )}
              </div>
            </div>
          </div>

          {/* 预测性预加载演示 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">🔮 预测性预加载演示</h2>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-3">选择用户行为模式</h4>
              <div className="flex flex-wrap gap-2">
                {Object.keys(predictiveConfig).map((view) => (
                  <button
                    key={view}
                    onClick={() => {
                      setCurrentView(view);
                      triggerPredictivePrecache(view);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentView === view
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>

            {/* 预加载进度 */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-700 mb-3">预加载资源</h4>
              <div className="space-y-2">
                {predictedResources.map((resource) => (
                  <div
                    key={resource}
                    className={`flex items-center justify-between p-2 rounded ${
                      loadingStates[resource] ? 'bg-blue-100' : 'bg-green-100'
                    }`}
                  >
                    <span className="text-sm text-gray-700 truncate">
                      {resource.split('/').pop()}
                    </span>
                    {loadingStates[resource] ? (
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <span className="text-green-500">✓</span>
                    )}
                  </div>
                ))}
                {predictedResources.length === 0 && (
                  <div className="text-gray-500 text-sm text-center py-4">
                    选择视图开始预测性预加载
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 智能缓存管理控制 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">⚡ 智能缓存管理控制</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">缓存操作</h4>
              <div className="space-y-3">
                <button
                  onClick={clearAllCache}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                >
                  清除所有缓存
                </button>

                <button
                  onClick={() => loadDataWithCache('/api/important-data')}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                >
                  测试数据加载
                </button>

                <button
                  onClick={() => {
                    memoryCache.clear();
                    updateAllStats();
                    setCacheStatus('内存缓存已清除');
                  }}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                >
                  清除内存缓存
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-3">系统状态</h4>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm text-gray-700 mb-2">{cacheStatus}</div>
                <div className="text-xs text-gray-500">
                  总缓存大小:{' '}
                  {cacheStats.memory.totalSize +
                    cacheStats.sw.totalSize +
                    cacheStats.disk.totalSize +
                    cacheStats.cdn.totalSize}
                  KB
                </div>
                <div className="text-xs text-gray-500">
                  总缓存项目:{' '}
                  {cacheStats.memory.count +
                    cacheStats.sw.count +
                    cacheStats.disk.count +
                    cacheStats.cdn.count}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部状态栏 */}
        <footer className="text-center mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8">
            <span className="text-sm text-gray-600">命中率: {hitRate.toFixed(1)}%</span>
            <span className="text-sm text-gray-600">请求数: {requests}</span>
            <span className="text-sm text-gray-600">
              缓存项目: {cacheStats.memory.count + cacheStats.sw.count}
            </span>
            <span className="text-sm text-gray-600">最后加载: {loadTime.toFixed(0)}ms</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
