import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import About from '../pages/About';
import NotFound from '../pages/NotFound';

/**
 * 基础路由组件
 * 使用HashRouter实现hash模式路由
 */
const AppRoutes: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* 根路由使用Layout组件作为布局 */}
        <Route path="/" element={<Layout />}>
          {/* 嵌套路由，内容会显示在Layout的Outlet中 */}
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          {/* 404页面，匹配所有未定义的路由 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default AppRoutes;
