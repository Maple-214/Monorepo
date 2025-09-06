import type { RequestInterceptor, ResponseInterceptor } from './types';

export class InterceptorManager<T> {
  private handlers: T[] = [];
  use(handler: T) {
    this.handlers.push(handler);
  }
  getHandlers() {
    return this.handlers.slice();
  }
  clear() {
    this.handlers = [];
  }
}

export const requestInterceptors = new InterceptorManager<RequestInterceptor>();
export const responseInterceptors = new InterceptorManager<ResponseInterceptor<unknown>>();
