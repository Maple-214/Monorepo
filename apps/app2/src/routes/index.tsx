import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
/**
 * 基础路由组件
 * 使用HashRouter实现hash模式路由
 */
const AppRoutes: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* 根路由使用Layout组件作为布局 */}
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </HashRouter>
  );
};

export default AppRoutes;
