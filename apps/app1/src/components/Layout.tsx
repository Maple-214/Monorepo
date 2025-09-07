import React from 'react';
import { Outlet } from 'react-router-dom';
import { Card } from '@heroui/react';

interface LayoutProps {
  children?: React.ReactNode;
}

/**
 * 基础布局组件
 * 集成HeroUI组件，提供应用的基本结构
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 主内容区域 */}
      <main className="flex-grow">
        <div className="py-8">
          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
            {/* 内容区域 */}
            <div className="p-6 md:p-8">{children || <Outlet />}</div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Layout;
