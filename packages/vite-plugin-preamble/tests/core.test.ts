import { describe, it, expect, vi } from 'vitest';
import { createPreamblePlugin } from '../src/core';

// Mock console.log
const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

// Mock process.env
const originalEnv = { ...process.env };

describe('Vite Preamble Plugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
    consoleLogSpy.mockRestore();
  });

  it('should create plugin with default options', () => {
    const plugin = createPreamblePlugin();

    expect(plugin).toBeDefined();
    expect(plugin.name).toBe('custom-react-plugin');
    expect(plugin.enforce).toBe('pre');
    expect(plugin.config).toBeDefined();
    expect(plugin.transform).toBeDefined();
    expect(plugin.configureServer).toBeDefined();
  });

  it('should create plugin with custom options', () => {
    const plugin = createPreamblePlugin({
      debug: true,
      extensions: ['.tsx', '.jsx', '.js'],
      jsxInject: `import React from 'react';`,
    });

    expect(plugin).toBeDefined();
    // 处理ObjectHook类型的config方法
    const configHandler =
      typeof plugin.config === 'function' ? plugin.config : plugin.config?.handler;
    const mockConfig = {};
    // 使用类型断言确保command属性符合ConfigEnv类型要求
    const mockEnv = { command: 'serve' as const, mode: 'development' };
    const configResult = configHandler!(mockConfig, mockEnv);

    // 由于config可能返回Promise，我们需要适当处理
    if (configResult && typeof configResult === 'object' && 'define' in configResult) {
      expect((configResult as any).define?.['__PREAMBLE_DEBUG__']).toBe(true);
      expect((configResult as any).esbuild?.jsxInject).toBe(`import React from 'react';`);
    }
  });

  it('should inject preamble code for TSX files', () => {
    const plugin = createPreamblePlugin();
    const testCode = `const Component = () => <div>Hello</div>;`;
    // 处理ObjectHook类型的transform方法，使用类型断言简化调用
    const transformHandler =
      typeof plugin.transform === 'function' ? plugin.transform : plugin.transform?.handler;
    // 直接调用，不需要mockContext
    const transformedCode = (transformHandler as any)(testCode, 'test.tsx');

    expect(transformedCode).toContain('// @vitejs/plugin-react automatic JSX runtime');
    expect(transformedCode).toContain('window.defineReactRefreshBoundary = (fn) => fn;');
    expect(transformedCode).toContain(testCode);
  });

  it('should not inject preamble code for non-specified files', () => {
    const plugin = createPreamblePlugin();
    const testCode = `console.log('test');`;
    // 处理ObjectHook类型的transform方法，使用类型断言简化调用
    const transformHandler =
      typeof plugin.transform === 'function' ? plugin.transform : plugin.transform?.handler;
    // 直接调用，不需要mockContext
    const transformedCode = (transformHandler as any)(testCode, 'test.ts');

    expect(transformedCode).toBe(testCode);
  });

  it('should inject preamble debug logs when debug is enabled', () => {
    const plugin = createPreamblePlugin({ debug: true });
    const testCode = `const Component = () => <div>Hello</div>;`;

    // Debug logs are in the transformed code, but not executed here
    // 处理ObjectHook类型的transform方法，使用类型断言简化调用
    const transformHandler =
      typeof plugin.transform === 'function' ? plugin.transform : plugin.transform?.handler;
    // 直接调用，不需要mockContext
    const transformedCode = (transformHandler as any)(testCode, 'test.tsx');

    expect(transformedCode).toContain(`console.log('Preamble injected for:', 'test.tsx');`);
    expect(consoleLogSpy).not.toHaveBeenCalled(); // Console log is in the code but not executed
  });

  it('should configure server middleware correctly', () => {
    const plugin = createPreamblePlugin();
    // 使用类型断言来简化mockServer的创建
    const mockServer = {
      middlewares: {
        use: vi.fn((middleware) => {
          // Simulate middleware execution for a TSX file
          const mockReq = { url: '/test.tsx' };
          const mockRes = {
            setHeader: vi.fn(),
          };
          const mockNext = vi.fn();

          middleware(mockReq, mockRes, mockNext);

          expect(mockRes.setHeader).toHaveBeenCalledWith('X-Preamble-Injection', 'enabled');
          expect(mockNext).toHaveBeenCalled();
        }),
      },
    } as any; // 使用any类型绕过ViteDevServer的严格类型检查

    // 处理ObjectHook类型的configureServer方法
    const configureServerHandler =
      typeof plugin.configureServer === 'function'
        ? plugin.configureServer
        : plugin.configureServer?.handler;
    configureServerHandler!(mockServer);

    expect(mockServer.middlewares.use).toHaveBeenCalled();
  });
});
