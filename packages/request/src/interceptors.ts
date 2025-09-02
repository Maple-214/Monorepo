import { RequestInterceptor, ResponseInterceptor } from './types';

export class InterceptorManager<T> {
  private handlers: Array<T> = [];
  use(handler: T) {
    this.handlers.push(handler);
  }
  getHandlers(): T[] {
    return this.handlers;
  }
}

export const requestInterceptors = new InterceptorManager<RequestInterceptor>();
export const responseInterceptors = new InterceptorManager<ResponseInterceptor>();
