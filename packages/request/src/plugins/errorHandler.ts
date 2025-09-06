import { responseInterceptors } from '../interceptors';

/**
 * 简单错误标准化插件：当服务返回 { error, message } 等结构时转为抛出标准 SDKError
 */
export function setupErrorHandlerPlugin() {
  responseInterceptors.use(async (res: unknown) => {
    // 如果后端以成功响应但内含 error 字段，抛出
    if (typeof res === 'object' && res !== null) {
      const anyRes = res as any;
      if (anyRes?.error || anyRes?.success === false) {
        const e: any = new Error(anyRes?.message || 'API Error');
        e.data = res;
        throw e;
      }
    }
    return res;
  });
}
