import { defineConfig, type PluginOption, type ConfigEnv } from 'vite';
import { federation } from '@module-federation/vite';
import { preamblePlugin } from '@anmx/vite-plugin-preamble';
import path from 'node:path';

export default defineConfig(({ command }: ConfigEnv) => {
  const isDev = command === 'serve';

  return {
    base: isDev ? '/' : '/app1/',
    plugins: [
      preamblePlugin,
      federation({
        name: 'app1',
        filename: 'remoteEntry.js',
        exposes: {
          './App': './src/App.tsx',
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: '^18.0.0',
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '^18.0.0',
          },
        },
      }) as PluginOption,
    ],
    build: {
      target: 'esnext',
      modulePreload: false,
      outDir: 'dist',
      minify: false,
      sourcemap: true,
      rollupOptions: {
        output: {
          format: 'es' as const,
          exports: 'named' as const, // 修复：使用 const 断言
          inlineDynamicImports: false,
        },
      },
    },
    server: {
      port: 5001,
      cors: true,
      hmr: {
        protocol: 'ws',
        host: 'localhost',
      },
    },
    resolve: {
      alias: {
        '@anmx/ui': path.resolve(__dirname, '../../packages/ui/src'),
        '@anmx/utils': path.resolve(__dirname, '../../packages/utils/src'),
      },
    },
  };
});
