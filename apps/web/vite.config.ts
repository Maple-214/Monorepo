import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { federation } from '@module-federation/vite';

export default defineConfig(({ command }) => {
  const isDev = command === 'serve';

  return {
    plugins: [
      react(),
      federation({
        name: 'web',
        // ✅ 静态声明 remotes（开发期最稳）
        remotes: {
          // 用对象写法，明确 type=module（Vite 产物是 ESM）
          app1: {
            name: 'app1', // 👈 必须加上 name
            type: 'module',
            entry: 'http://localhost:5001/remoteEntry.js',
          },
          // 如还有 app2，照此追加
          // app2: { type: 'module', entry: 'http://localhost:5002/remoteEntry.js' },
        },
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
    server: { port: 5173 },
    build: { outDir: 'dist', sourcemap: isDev, target: 'es2022' },
    optimizeDeps: { include: [] },
    cacheDir: '../../node_modules/.vite',
  };
});
