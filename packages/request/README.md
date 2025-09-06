# @anmx/request

<p align="center">
  <a href="#">
    <img src="https://img.shields.io/npm/v/@anmx/request.svg" alt="npm version" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/npm/l/@anmx/request.svg" alt="license" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/bundlephobia/min/@anmx/request" alt="minified size" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  </a>
</p>

<p align="center">
  轻量级、功能丰富的 HTTP 请求库，基于浏览器原生 <code>fetch</code> API 封装
</p>

## ✨ 特性

- 🚀 **基础请求功能** - 完整封装 fetch API，支持所有 HTTP 方法
- 📦 **缓存机制** - 多策略缓存支持，提升性能和用户体验
- 🔄 **请求去重** - 自动合并相同请求，减少网络开销
- 🛠️ **拦截器系统** - 请求/响应拦截，灵活处理各种场景
- 🔄 **自动重试** - 指数退避算法，提高请求成功率
- 🔐 **认证管理** - 自动处理 401，支持 token 刷新
- 📝 **日志记录** - 可配置的请求/响应日志，便于调试
- 🚨 **错误处理** - 统一的错误处理机制，标准化错误格式
- 🔧 **插件化设计** - 易于扩展，支持自定义功能
- 📋 **TypeScript 支持** - 完整的类型定义，提供更好的开发体验

## 🚀 安装

```bash
# 使用 pnpm
pnpm add @anmx/request

# 使用 npm
npm install @anmx/request

# 使用 yarn
yarn add @anmx/request
```

## 📖 使用示例

### 基础请求

```typescript
import { http } from '@anmx/request';

// GET 请求
const users = await http.get<User[]>('/api/users');

// POST 请求（自动设置 Content-Type 和 JSON 序列化）
const createdUser = await http.post<User>('/api/users', {
  name: 'John',
  age: 30,
});

// PUT 请求
const updatedUser = await http.put<User>('/api/users/1', {
  name: 'John Doe',
});

// DELETE 请求
await http.delete('/api/users/1');
```

### 高级配置

```typescript
import { request } from '@anmx/request';

const data = await request<UserData>('/api/users', {
  method: 'GET',
  timeout: 5000, // 5秒超时
  cacheTime: 60000, // 缓存1分钟
  retry: 3, // 重试3次
  retryDelay: 300, // 初始重试延迟300ms
  dedupe: true, // 启用请求去重
  headers: {
    'X-Custom-Header': 'value',
  },
});
```

## 🧩 插件系统

### 认证插件 (Auth)

自动为请求添加认证令牌，并在令牌过期时自动刷新。

```typescript
import { setupAuthPlugin } from '@anmx/request';

// 设置认证插件，提供刷新令牌的函数
setupAuthPlugin(async () => {
  // 从后端获取新的令牌
  const res = await fetch('/api/refresh-token');
  const data = await res.json();
  return data.token;
});
```

### 缓存插件 (Cache)

提供请求缓存功能，可手动操作缓存。

```typescript
import { cacheAPI, http } from '@anmx/request';

// 通过配置使用缓存
const data = await http.get('/api/data', {
  cacheTime: 60000, // 缓存1分钟
  cacheStrategy: 'cache-first', // 缓存优先策略
});

// 手动操作缓存
const cachedData = cacheAPI.get<UserData>('custom-key');
cacheAPI.set('custom-key', userData, 5 * 60 * 1000); // 缓存5分钟
cacheAPI.clear('custom-key'); // 清除特定缓存
cacheAPI.clear(); // 清除所有缓存
```

### 日志插件 (Logger)

记录请求和响应信息，便于调试。

```typescript
import { setupLoggerPlugin } from '@anmx/request';

// 设置日志插件，可选配置日志级别
setupLoggerPlugin({ level: 'debug' }); // 'info' | 'debug' | 'warn' | 'error'
```

### 重试插件 (Retry)

提供请求失败自动重试功能。

```typescript
import { retry } from '@anmx/request';

// 使用重试功能包装任意异步函数
const result = await retry(() => fetchData(), {
  retries: 3,
  delay: 300,
  factor: 2,
  shouldRetry: (error) => {
    // 只对网络错误重试
    return error instanceof Error && error.message.includes('Network');
  },
  onRetry: (error, attempt) => {
    console.log(`Retry attempt ${attempt}: ${error.message}`);
  },
});
```

### 错误处理插件 (ErrorHandler)

标准化错误处理，自动处理特定格式的错误响应。

```typescript
import { setupErrorHandlerPlugin } from '@anmx/request';

// 设置错误处理插件
setupErrorHandlerPlugin();
// 会自动处理返回 { error: true, message: '错误信息' } 或 { success: false } 格式的响应
```

## 🔧 拦截器

```typescript
import { requestInterceptors, responseInterceptors } from '@anmx/request';

// 请求拦截器
requestInterceptors.use(async (url, options) => {
  // 可以在这里修改 URL、添加 headers、处理认证等
  return [
    url,
    {
      ...options,
      headers: {
        ...options.headers,
        'X-Custom': 'value',
      },
    },
  ];
});

// 响应拦截器
responseInterceptors.use(async (response, url, options) => {
  // 可以在这里处理响应数据、统一错误处理等
  return response;
});
```

## 📋 API 参考

### 核心 API

#### request 函数

```typescript
function request<T = unknown>(inputUrl: string, options?: RequestOptions): Promise<T>;
```

- **参数**：
  - `inputUrl`: 请求 URL
  - `options`: 请求配置选项
- **返回值**：`Promise<T>` - 解析为指定类型的 Promise

#### http 对象

```typescript
const http = {
  get: <T = unknown>(url: string, options?: RequestOptions) => Promise<T>,
  post: <T = unknown>(url: string, body?: unknown, options?: RequestOptions) => Promise<T>,
  put: <T = unknown>(url: string, body?: unknown, options?: RequestOptions) => Promise<T>,
  delete: <T = unknown>(url: string, options?: RequestOptions) => Promise<T>,
};
```

### 配置选项 (RequestOptions)

| 属性          | 类型          | 描述                 | 默认值     |
| ------------- | ------------- | -------------------- | ---------- |
| method        | string        | HTTP 方法            | 'GET'      |
| baseURL       | string        | 请求基础 URL         | -          |
| timeout       | number        | 超时时间（毫秒）     | -          |
| cacheKey      | string        | 缓存键名             | -          |
| cacheTime     | number        | 缓存时间（毫秒）     | 0 (不缓存) |
| cacheStrategy | CacheStrategy | 缓存策略             | -          |
| forceRefresh  | boolean       | 是否强制刷新缓存     | false      |
| dedupe        | boolean       | 是否启用请求去重     | true       |
| retry         | number        | 重试次数             | 0          |
| retryDelay    | number        | 初始重试延迟（毫秒） | 300        |
| dedupeKey     | string        | 自定义去重键         | -          |
| body          | any           | 请求体               | -          |
| headers       | HeadersInit   | 请求头               | -          |

### 缓存策略 (CacheStrategy)

```typescript
export type CacheStrategy =
  | 'no-cache' // 不使用缓存
  | 'cache-first' // 优先使用缓存
  | 'network-first' // 优先使用网络
  | 'stale-while-revalidate'; // 使用缓存同时更新
```

### 拦截器管理器 (InterceptorManager)

```typescript
class InterceptorManager<T> {
  use(handler: T): void; // 添加拦截器
  getHandlers(): T[]; // 获取所有拦截器
  clear(): void; // 清除所有拦截器
}

// 全局请求拦截器
export const requestInterceptors = new InterceptorManager<RequestInterceptor>();

// 全局响应拦截器
export const responseInterceptors = new InterceptorManager<ResponseInterceptor<unknown>>();
```

### 插件 API

```typescript
// 认证插件
function setupAuthPlugin(refreshFn: () => Promise<string>): void

// 日志插件
function setupLoggerPlugin(opts?: { level?: 'info' | 'debug' | 'warn' | 'error' }): void

// 错误处理插件
function setupErrorHandlerPlugin(): void

// 重试函数
function retry<T>(fn: () => Promise<T>, options?: RetryOptions): Promise<T>

// 缓存 API
const cacheAPI = {
  get: <T = unknown>(key: string) => T | undefined,
  set: <T = unknown>(key: string, data: T, ttl: number) => void,
  clear: (key?: string) => void
}
```

## 🎯 高级功能

### 请求去重

自动合并短时间内相同的请求，避免重复请求服务器：

```typescript
// 短时间内发送相同的请求会被自动合并
const promise1 = request('/api/users');
const promise2 = request('/api/users');
// promise1 和 promise2 指向同一个 Promise 对象
```

### 超时处理

支持设置请求超时时间，超时后自动取消请求：

```typescript
request('/api/slow-endpoint', {
  timeout: 5000, // 5 秒后超时
});
```

### 指数退避重试

失败重试时使用指数退避算法，避免短时间内频繁重试：

```typescript
request('/api/unstable-endpoint', {
  retry: 3, // 重试 3 次
  retryDelay: 300, // 初始延迟 300ms
});
// 实际延迟时间: 300ms, 600ms, 1200ms
```

## 🔍 完整使用示例

```typescript
import {
  http,
  requestInterceptors,
  setupAuthPlugin,
  setupLoggerPlugin,
  setupErrorHandlerPlugin,
  cacheAPI,
} from '@anmx/request';

// 全局配置
requestInterceptors.use((url, options) => {
  const baseURL =
    process.env.NODE_ENV === 'production' ? 'https://api.example.com' : 'http://localhost:3000';

  return [
    `${baseURL}${url}`,
    {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 全局超时设置
    },
  ];
});

// 初始化插件
setupLoggerPlugin({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
});
setupErrorHandlerPlugin();
setupAuthPlugin(async () => {
  const res = await fetch('/api/refresh-token');
  const data = await res.json();
  return data.token;
});

// 业务请求函数
export async function fetchUserData(userId: string) {
  try {
    const user = await http.get<UserData>(`/api/users/${userId}`, {
      cacheTime: 60000, // 缓存 1 分钟
      retry: 2, // 重试 2 次
    });
    return user;
  } catch (error) {
    console.error('获取用户数据失败:', error);
    throw error;
  }
}

// 更新数据并清除相关缓存
export async function updateUserProfile(userId: string, profile: Partial<UserData>) {
  try {
    const updatedUser = await http.put<UserData>(`/api/users/${userId}`, profile, { retry: 3 });

    // 更新成功后清除相关缓存
    cacheAPI.clear(`GET:/api/users/${userId}:{}`);
    cacheAPI.clear(`GET:/api/users:{}`);

    return updatedUser;
  } catch (error) {
    console.error('更新用户资料失败:', error);
    throw error;
  }
}
```

## 📝 最佳实践

1. **错误处理**：始终使用 try/catch 包装请求调用，以妥善处理各种异常情况

2. **认证管理**：使用 auth 插件统一管理认证令牌，实现自动刷新机制

3. **缓存策略**：
   - 对于不常变化的数据使用较长缓存时间
   - 对于频繁变化的数据使用 `stale-while-revalidate` 策略
   - 数据更新后记得清除相关缓存

4. **性能优化**：
   - 对高频请求启用去重功能
   - 为不稳定的网络环境配置适当的重试策略
   - 设置合理的超时时间（通常为 10-30 秒）

5. **环境适配**：在不同环境中使用不同的配置
   - 开发环境：详细日志、较短超时、本地 API
   - 生产环境：错误级别日志、标准超时、生产 API

6. **类型安全**：充分利用 TypeScript 类型系统，为所有请求和响应定义明确的类型

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进这个库。

## 📄 许可证

MIT
发送 DELETE 请求。

request<T>(url, options?)

底层通用请求函数，http 系列方法都是基于它封装。
