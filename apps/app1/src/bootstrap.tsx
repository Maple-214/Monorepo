// 全局preamble检测支持变量
declare global {
  interface Window {
    __vite_plugin_react_preamble__?: boolean;
    defineReactRefreshBoundary?: <T extends (...args: any[]) => any>(fn: T) => T;
  }
}

if (typeof window !== 'undefined') {
  window.__vite_plugin_react_preamble__ = true;
  window.defineReactRefreshBoundary = <T extends (...args: any[]) => any>(fn: T) => fn;
}

// 导入全局样式
import './styles/global.css';

// 导入React和ReactDOM
import React from 'react';
import ReactDOM from 'react-dom/client';

// 动态导入App组件，确保正确的preamble检测
import('./App').then(({ default: App }) => {
  const root = document.getElementById('root');
  if (root) {
    try {
      const rootElement = ReactDOM.createRoot(root);
      // 移除React.StrictMode以减少可能的preamble检测干扰
      rootElement.render(<App />);
    } catch (error) {
      console.error('Failed to render App component:', error);
      // 降级渲染，直接在root元素中显示错误信息
      root.innerHTML =
        '<div style="padding: 20px; color: red;">Failed to load App1. Please try refreshing the page.</div>';
    }
  } else {
    console.error('Root element not found');
  }
});
