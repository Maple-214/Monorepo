import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import path from 'node:path';

export default defineConfig(({ command }) => {
  const isDev = command === 'serve';

  return {
    // 关键：生产跑在 /app2/ 子路径
    base: isDev ? '/' : '/app2/',
    plugins: [
      react(),
      federation({
        name: 'app2',
        filename: 'remoteEntry.js',
        exposes: { './App': './src/App.tsx' },
        shared: {
          react: { singleton: true, requiredVersion: '^18.0.0' },
          'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        },
      }),
    ],
    build: { target: 'esnext', modulePreload: false, outDir: 'dist' },
    server: { port: 5001, cors: true },
    resolve: {
      alias: {
        '@anmx/ui': path.resolve(__dirname, '../../packages/ui/src'),
        '@anmx/utils': path.resolve(__dirname, '../../packages/utils/src'),
      },
    },
  };
});
