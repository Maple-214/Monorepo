# @anmx/vite-plugin-preamble

一个解决Vite在模块联邦（Module Federation）场景下React Fast Refresh preamble检测问题的插件。

## 问题背景

在使用Vite和模块联邦构建微前端应用时，常常会遇到React组件无法热更新的问题。这是因为在模块联邦环境中，Vite的@vitejs/plugin-react插件生成的preamble代码无法被正确检测和执行。

## 特性

- ✅ 自动为React组件注入必要的preamble代码
- ✅ 支持自定义配置选项
- ✅ 提供调试模式，方便排查问题
- ✅ 兼容Vite 5.x版本
- ✅ 支持TypeScript类型定义

## 安装

```bash
# 使用npm
npm install @anmx/vite-plugin-preamble --save-dev

# 使用pnpm
pnpm add @anmx/vite-plugin-preamble -D

# 使用yarn

yarn add @anmx/vite-plugin-preamble --dev
```

## 使用方法

在vite.config.ts中添加插件配置：

```ts
import { defineConfig } from 'vite';
import { preamblePlugin } from '@anmx/vite-plugin-preamble';

// 或者使用默认导出
// import preamblePlugin from '@anmx/vite-plugin-preamble';

export default defineConfig({
  plugins: [
    preamblePlugin(),
    // 其他插件...
  ],
});
```

## 配置选项

插件支持以下配置选项：

```ts
import { defineConfig } from 'vite';
import { createPreamblePlugin } from '@anmx/vite-plugin-preamble';

export default defineConfig({
  plugins: [
    createPreamblePlugin({
      // 是否启用调试模式，会在控制台输出preamble注入的相关信息
      debug: true,

      // 需要注入preamble代码的文件扩展名
      extensions: ['.tsx', '.jsx'],

      // 自定义JSX注入内容
      jsxInject: `import React from 'react'`,
    }),
  ],
});
```

## 类型定义

```ts
interface PreamblePluginOptions {
  debug?: boolean;
  extensions?: string[];
  jsxInject?: string;
}
```

## 在模块联邦中的使用

在使用模块联邦时，确保在所有需要共享React组件的应用中都配置了此插件：

```ts
// 主应用的vite.config.ts
import { defineConfig } from 'vite';
import { federation } from '@module-federation/vite';
import { preamblePlugin } from '@anmx/vite-plugin-preamble';

export default defineConfig({
  plugins: [
    preamblePlugin(),
    federation({
      name: 'host',
      remotes: {
        remoteApp: 'http://localhost:5001/remoteEntry.js',
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
    }),
  ],
});

// 远程应用的vite.config.ts
import { defineConfig } from 'vite';
import { federation } from '@module-federation/vite';
import { preamblePlugin } from '@anmx/vite-plugin-preamble';

export default defineConfig({
  plugins: [
    preamblePlugin(),
    federation({
      name: 'remoteApp',
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
    }),
  ],
});
```

## 开发和测试

```bash
# 克隆仓库
git clone https://github.com/Maple-214/Monorepo.git
cd Monorepo/packages/@anmx/vite-plugin-preamble

# 安装依赖
pnpm install

# 构建插件
pnpm -F @anmx/vite-plugin-preamble build

# 运行测试
pnpm -F @anmx/vite-plugin-preamble test

# 运行测试并生成覆盖率报告
pnpm -F @anmx/vite-plugin-preamble test:coverage
```

## License

MIT License © 2025 [Maple-214](https://github.com/Maple-214)
