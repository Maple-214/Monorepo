import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.base.json',
        tsconfigRootDir: import.meta.dirname, // 明确设置为当前配置文件所在目录
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      // 'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    ignores: [
      'apps/maple-blog/**', // 忽略 maple-blog 目录下的所有文件
      '**/dist/**', // 忽略所有dist目录
      '**/node_modules/**', // 忽略node_modules目录
      '**/.__mf__temp/**', // 忽略临时文件目录
      'commitlint.config.cjs', // 忽略commitlint配置文件
      '**/postcss.config.js', // 匹配任意层级的 postcss.config.js
      '**/tailwind.config.js', // 匹配任意层级的 tailwind.config.js
      '**/webpack.config.js', // 匹配任意层级的 webpack.config.js
      '**/vite.config.js', // 匹配任意层级的 vite.config.js
      'eslint.config.js', // 排除 ESLint 配置文件本身
      '**/eslint.config.js', // 如果是 monorepo，排除所有层级的 ESLint 配置文件
    ],
  },
);
