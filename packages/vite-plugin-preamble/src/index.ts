/**
 * Vite Preamble 插件
 *
 * 一个解决Vite在模块联邦场景下preamble检测问题的插件
 * 确保React Fast Refresh功能在模块联邦环境中正常工作
 */

import {
  createPreamblePlugin as _createPreamblePlugin,
  preamblePlugin as _preamblePlugin,
} from './core';

import type {
  PreamblePluginOptions,
  DefineReactRefreshBoundaryFunction,
  PreambleWindow,
} from './types';

// 重新导出插件函数和默认导出
export const createPreamblePlugin = _createPreamblePlugin;
export const preamblePlugin = _preamblePlugin;
export default preamblePlugin;

export type { PreamblePluginOptions, DefineReactRefreshBoundaryFunction, PreambleWindow };
