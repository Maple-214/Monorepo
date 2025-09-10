import React from 'react';
import { HeroUIProvider } from '@heroui/react';
import AppRoutes from './routes';
// 导入全局样式
import './styles/global.css';

/**
 * 应用主组件
 * 集成HeroUI和路由系统
 */
export default function App() {
  return (
    <HeroUIProvider>
      <AppRoutes />
    </HeroUIProvider>
  );
}
