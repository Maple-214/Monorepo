# @anmx/request

企业级通用 Fetch SDK，支持缓存、重试、拦截器、鉴权。

## ✨ 功能特性

- 基于 `fetch` 封装
- 支持请求 & 响应拦截器
- 自动附带 `Authorization` 头
- 401 自动刷新 token & 重试
- 缓存层（内存缓存）
- 重试机制（指数退避）
- 支持 TypeScript 类型推导
- 内置 Vitest 测试

## 🚀 使用方法

```ts
import { request } from '@anmx/request';

async function load() {
  const data = await request<{ name: string }>('/api/user');
  console.log(data.name);
}
```
