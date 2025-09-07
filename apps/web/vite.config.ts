import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { federation } from '@module-federation/vite';
import { remotes } from './mf/remote';

export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve';
  const isTest = mode === 'test'; // 👈 Vitest 会注入 mode=test
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      !isTest &&
        federation({
          name: 'web',
          remotes: remotes(env),
          shared: {
            react: { singleton: true, requiredVersion: '^18.0.0' },
            'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
            '@heroui/react': { singleton: true, requiredVersion: '^2.8.3' },
          },
        }),
    ].filter(Boolean),
    resolve: {
      alias: {
        ...(isTest
          ? {
              // 👇 测试环境下把 app1/App 指向一个 mock
              'app1/App': path.resolve(__dirname, 'test/mocks/MockApp1.tsx'),
              'app2/App': path.resolve(__dirname, 'test/mocks/MockApp2.tsx'),
            }
          : {}),
        '@anmx/ui': isDev
          ? path.resolve(__dirname, '../../packages/ui/src')
          : path.resolve(__dirname, '../../packages/ui/dist'),
        '@anmx/utils': isDev
          ? path.resolve(__dirname, '../../packages/utils/src')
          : path.resolve(__dirname, '../../packages/utils/dist'),
      },
    },
    server: {
      port: 5173,
    },
    build: { outDir: 'dist', sourcemap: isDev, target: 'es2022', cssCodeSplit: true },
    optimizeDeps: { include: [] },
    cacheDir: '../../node_modules/.vite',
    test: {
      globals: true, // 让 describe/it/expect 生效
      environment: 'jsdom', // 支持 React DOM 测试
      setupFiles: './test/setup.ts', // 测试前的初始化文件
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
      },
      server: {
        deps: {
          inline: ['app1/App', 'app2/App'],
        },
      },
    },
  };
});
