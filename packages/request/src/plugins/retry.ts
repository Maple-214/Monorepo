import { RetryOptions } from '../types';
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
      await new Promise((resolve) => setTimeout(resolve, currentDelay));
      currentDelay *= factor;
    }
  }
  throw new Error('Retry failed unexpectedly');
}
