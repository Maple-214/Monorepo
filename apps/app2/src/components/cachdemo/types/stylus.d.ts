// src/types/stylus.d.ts
declare module '*.styl' {
  const content: { [className: string]: string };
  export default content;
}

// Service Worker 类型扩展
interface Navigator {
  serviceWorker: {
    register: (
      scriptURL: string,
      options?: RegistrationOptions,
    ) => Promise<ServiceWorkerRegistration>;
    ready: Promise<ServiceWorkerRegistration>;
  };
}

interface Window {
  caches: CacheStorage;
}
