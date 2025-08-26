import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { federation } from '@module-federation/vite';
import { remotes } from './mf/remote';

export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve';
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      federation({
        name: 'web',
        // ✅ 静态声明 remotes（开发期最稳）
        remotes: remotes(env),
        shared: {
          react: { singleton: true, requiredVersion: '^18.0.0' },
          'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        },
      }),
    ],
    resolve: {
      alias: {
        '@acme/ui': isDev
          ? path.resolve(__dirname, '../../packages/ui/src')
          : path.resolve(__dirname, '../../packages/ui/dist'),
        '@acme/utils': isDev
          ? path.resolve(__dirname, '../../packages/utils/src')
          : path.resolve(__dirname, '../../packages/utils/dist'),
      },
    },
    server: {
      port: 5173,
      // 关键：把 /docs/* 代理到 VitePress dev server，并且 **去掉 /docs 前缀**
      // proxy: {
      //   '/docs': {
      //     target: 'http://localhost:5003',
      //     changeOrigin: true,
      //     // 去掉 /docs 前缀 -> 转发到 VitePress 的根路径
      //     rewrite: (path) => path.replace(/^\/docs/, ''),
      //     // 可选：配置请求头，确保远端服务按预期识别
      //     configure: (proxy) => {
      //       proxy.on('proxyReq', (proxyReq, req) => {
      //         // 标记来源，若需要在 VitePress side 做特殊处理可以读取
      //         proxyReq.setHeader('x-forwarded-host', req.headers.host || '');
      //         proxyReq.setHeader('x-forwarded-proto', 'http');
      //       });
      //     }
      //   }
      // }
    },
    build: { outDir: 'dist', sourcemap: isDev, target: 'es2022' },
    optimizeDeps: { include: [] },
    cacheDir: '../../node_modules/.vite',
  };
});
