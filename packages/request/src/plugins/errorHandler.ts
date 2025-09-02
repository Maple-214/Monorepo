import { responseInterceptors } from '../core';
import type { RequestOptions, SDKError } from '../core';

/**
 * 全局错误处理插件
 * - 捕获接口异常并统一处理
 * - 可用于埋点/上报
 */
export function setupErrorHandlerPlugin(
  handler: (error: SDKError, url: string, options: RequestOptions) => void,
) {
  responseInterceptors.use(async (res, url, options) => {
    // 假设后端返回统一格式 { code: number, message: string, data: any }
    if ((res as any)?.code && (res as any).code !== 0) {
      const error: SDKError = new Error((res as any).message || 'Request error');
      error.status = (res as any).code;
      error.url = url;
      handler(error, url, options);
      throw error;
    }

    return res;
  });
}
