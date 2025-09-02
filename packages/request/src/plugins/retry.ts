/**
 * 重试工具：支持异步任务的自动重试
 */
export interface RetryOptions {
  retries?: number; // 最大重试次数
  delay?: number; // 初始延迟 (ms)
  factor?: number; // 延迟增长因子 (指数退避)
  shouldRetry?: (error: unknown) => boolean; // 判断是否需要重试
  onRetry?: (error: unknown, attempt: number) => void; // 每次重试时回调
}

export async function retry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const { retries = 3, delay = 300, factor = 2, shouldRetry = () => true, onRetry } = options;

  let attempt = 0;
  let currentDelay = delay;

  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt >= retries || !shouldRetry(error)) {
        throw error;
      }

      onRetry?.(error, attempt);

      // 等待一段时间再继续
      await new Promise((resolve) => setTimeout(resolve, currentDelay));
      currentDelay *= factor;
    }
  }

  // 按理说不会执行到这里
  throw new Error('Retry failed unexpectedly');
}
