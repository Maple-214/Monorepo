import type { Plugin } from 'vite';

/**
 * Vite插件配置选项
 */
export interface PreamblePluginOptions {
  /**
   * 是否启用调试模式
   * @default false
   */
  debug?: boolean;

  /**
   * 需要注入preamble代码的文件扩展名
   * @default ['.tsx', '.jsx']
   */
  extensions?: string[];

  /**
   * 自定义JSX注入内容
   * @default `import React from 'react'`
   */
  jsxInject?: string;
}

/**
 * 创建Vite Preamble插件
 *
 * 此插件解决Vite在模块联邦场景下的preamble检测问题，
 * 通过自动为React组件注入必要的preamble代码，确保React Fast Refresh功能正常工作。
 *
 * @param options 插件配置选项
 * @returns Vite插件对象
 * @example
 * ```ts
 * // vite.config.ts
 * import { defineConfig } from 'vite';
 * import { preamblePlugin } from '@anmx/vite-plugin-preamble';
 *
 * export default defineConfig({
 *   plugins: [
 *     preamblePlugin({
 *       debug: true,
 *       extensions: ['.tsx', '.jsx', '.js']
 *     })
 *   ]
 * });
 * ```
 */
export function createPreamblePlugin(options: PreamblePluginOptions = {}): Plugin {
  const {
    debug = false,
    extensions = ['.tsx', '.jsx'],
    jsxInject = `import React from 'react'`,
  } = options;

  return {
    name: 'custom-react-plugin',
    enforce: 'pre',
    config: () => ({
      // 配置esbuild处理JSX
      esbuild: {
        jsx: 'automatic' as const,
        jsxInject,
      },
      // 定义全局变量
      define: {
        __PREAMBLE_DEBUG__: debug,
      },
    }),

    /**
     * 转换代码，为React相关文件注入preamble代码
     */
    transform(code, id) {
      // 检查文件是否需要处理
      const shouldProcess = extensions.some((ext) => id.endsWith(ext));

      if (!shouldProcess) {
        return code;
      }

      // 生成preamble代码
      const preambleCode = `// @vitejs/plugin-react automatic JSX runtime
// This preamble is added by custom-react-plugin to fix detection issues
if (typeof defineReactRefreshBoundary === 'undefined') {
  window.defineReactRefreshBoundary = (fn) => fn;
}

// Debug mode for preamble issues
if (typeof __PREAMBLE_DEBUG__ !== 'undefined' && __PREAMBLE_DEBUG__) {
  console.log('Preamble injected for:', '${id}');
}`;

      // 将preamble代码添加到文件开头
      return `${preambleCode}\n${code}`;
    },

    /**
     * 配置服务器中间件，为开发服务器添加对preamble的支持
     */
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // 检查请求的URL是否需要注入preamble支持
        const shouldInject = req.url && extensions.some((ext) => req.url!.endsWith(ext));

        if (shouldInject) {
          res.setHeader('X-Preamble-Injection', 'enabled');

          if (debug) {
            console.log('Preamble middleware hit for:', req.url);
          }
        }

        next();
      });
    },
  };
}

/**
 * 默认导出的preamble插件，使用默认配置
 */
export const preamblePlugin = createPreamblePlugin();

export default preamblePlugin;
