import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { federation } from '@module-federation/vite';

export default defineConfig(({ command }) => {
  const isDev = command === 'serve'; // 开发时为 true，构建时为 false

  return {
    plugins: [
      react(),
      federation({
        name: 'web',
        remotes: {
          app1: {
            type: 'module', // 👈 必须匹配 app1 的输出格式
            entry: 'http://localhost:5001/remoteEntry.js',
          },
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
    server: {
      port: 5173,
    },
    build: {
      outDir: 'dist',
      sourcemap: isDev, // 开发调试方便
    },
    // 🚀 性能优化
    optimizeDeps: { persist: true },
    cacheDir: '../../node_modules/.vite',
  };
});
