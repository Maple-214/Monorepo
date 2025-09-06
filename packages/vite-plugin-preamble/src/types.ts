/**
 * Vite Preamble插件配置选项接口
 */
export interface PreamblePluginOptions {
  /**
   * 是否启用调试模式
   * 当设置为true时，会在控制台输出preamble注入的相关信息
   * @default false
   */
  debug?: boolean;

  /**
   * 需要注入preamble代码的文件扩展名数组
   * 默认处理React JSX和TSX文件
   * @default ['.tsx', '.jsx']
   */
  extensions?: string[];

  /**
   * 自定义JSX注入内容
   * 用于在JSX/TSX文件顶部注入的代码
   * @default `import React from 'react'`
   */
  jsxInject?: string;
}

/**
 * 表示定义React刷新边界的函数类型
 * @template T 组件或函数类型
 */
export type DefineReactRefreshBoundaryFunction<T extends (...args: any[]) => any> = (fn: T) => T;

/**
 * 全局窗口对象扩展接口
 * 添加preamble相关的全局属性
 */
export interface PreambleWindow extends Window {
  /**
   * 定义React刷新边界的函数
   */
  defineReactRefreshBoundary?: DefineReactRefreshBoundaryFunction<any>;

  /**
   * 调试模式标志
   */
  __PREAMBLE_DEBUG__?: boolean;
}
