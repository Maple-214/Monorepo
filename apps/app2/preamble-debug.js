// Preamble调试辅助脚本
// 这个文件可以帮助诊断和解决@vitejs/plugin-react的preamble检测问题

/**
 * 检查当前环境中preamble相关变量是否正确设置
 */
function checkPreambleEnvironment() {
  const results = {
    hasPreamble: false,
    hasDefineReactRefreshBoundary: false,
    hasWindowPreamble: false,
    hasWindowDefineReactRefreshBoundary: false,
    errors: [],
    warnings: [],
  };

  try {
    // 检查全局变量
    if (typeof defineReactRefreshBoundary !== 'undefined') {
      results.hasDefineReactRefreshBoundary = true;
    } else {
      results.warnings.push('defineReactRefreshBoundary is not defined globally');
    }

    // 检查window对象上的变量
    if (typeof window !== 'undefined') {
      if (window.__vite_plugin_react_preamble__) {
        results.hasWindowPreamble = true;
      } else {
        results.warnings.push('__vite_plugin_react_preamble__ is not set on window');
      }

      if (typeof window.defineReactRefreshBoundary !== 'undefined') {
        results.hasWindowDefineReactRefreshBoundary = true;
      } else {
        results.warnings.push('defineReactRefreshBoundary is not defined on window');
      }

      // 综合判断
      results.hasPreamble =
        results.hasWindowPreamble && results.hasWindowDefineReactRefreshBoundary;
    } else {
      results.errors.push('Running in non-browser environment');
    }

    // 添加额外的调试信息
    results.debugInfo = {
      browser: typeof window !== 'undefined',
      node: typeof process !== 'undefined' && process.versions && process.versions.node,
      // 使用替代方法检测Vite环境，避免使用import.meta
      vite: typeof window !== 'undefined' && window.__PREAMBLE_DEBUG__ !== 'undefined',
    };
  } catch (error) {
    results.errors.push(`Error during preamble check: ${error.message}`);
  }

  return results;
}

/**
 * 修复preamble环境，在运行时添加必要的全局变量
 */
function fixPreambleEnvironment() {
  if (typeof window !== 'undefined') {
    // 确保window对象上有必要的preamble变量
    if (typeof window.__vite_plugin_react_preamble__ === 'undefined') {
      console.log('[Preamble Fix] Setting __vite_plugin_react_preamble__ on window');
      window.__vite_plugin_react_preamble__ = true;
    }

    if (typeof window.defineReactRefreshBoundary === 'undefined') {
      console.log('[Preamble Fix] Setting defineReactRefreshBoundary on window');
      window.defineReactRefreshBoundary = (fn) => fn;
    }

    // 也设置全局作用域
    if (typeof defineReactRefreshBoundary === 'undefined') {
      console.log('[Preamble Fix] Setting defineReactRefreshBoundary globally');
      // @ts-ignore
      defineReactRefreshBoundary = (fn) => fn;
    }
  }
}

/**
 * 输出preamble状态报告
 */
function reportPreambleStatus() {
  const status = checkPreambleEnvironment();
  console.log('[Preamble Status]', status);

  if (status.errors.length > 0) {
    console.error('[Preamble Error]', status.errors);
  }

  if (status.warnings.length > 0 && !status.hasPreamble) {
    console.warn('[Preamble Warning]', status.warnings);
    console.info('[Preamble Info] Attempting to fix preamble environment...');
    fixPreambleEnvironment();

    // 再次检查状态
    const newStatus = checkPreambleEnvironment();
    if (newStatus.hasPreamble) {
      console.log('[Preamble Success] Environment has been fixed!');
    } else {
      console.error('[Preamble Failed] Could not fix environment. Additional steps may be needed.');
    }
  }

  return status;
}

// 浏览器环境导出
if (typeof window !== 'undefined') {
  // 确保PreambleDebugger对象存在
  window.PreambleDebugger = window.PreambleDebugger || {};

  // 添加调试功能到window对象
  window.PreambleDebugger.checkPreambleEnvironment = checkPreambleEnvironment;
  window.PreambleDebugger.fixPreambleEnvironment = fixPreambleEnvironment;
  window.PreambleDebugger.reportPreambleStatus = reportPreambleStatus;
}
