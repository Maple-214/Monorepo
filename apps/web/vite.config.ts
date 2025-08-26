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
      // css: {
      //   modules: {
      //     localsConvention: 'camelCase'
      //   }
      // },
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
    server: { port: 5173 },
    build: { outDir: 'dist', sourcemap: isDev, target: 'es2022' },
    optimizeDeps: { include: [] },
    cacheDir: '../../node_modules/.vite',
  };
});
