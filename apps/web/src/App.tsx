import React, { useState } from 'react';
import RemoteApp1 from './RemoteApp1';
import RemoteApp2 from './RemoteApp2';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AdvancedCacheDemo } from './components/cachdemo';

// 导航项配置
const navItems = [
  {
    path: '/',
    label: '主站首页',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    path: '/app1',
    label: '子应用 App1',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    path: '/app2',
    label: '子应用 App2',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

// 移动端菜单按钮组件
const MobileMenuButton: React.FC<{ isOpen: boolean; onClick: () => void }> = ({
  isOpen,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
    aria-label="Toggle menu"
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {isOpen ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      )}
    </svg>
  </button>
);

// 导航组件
const Navigation: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo 区域 */}
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center space-x-3 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors ml-4"
                onClick={closeMobileMenu}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">MF</span>
                </div>
                <span className="hidden sm:block">微前端平台</span>
              </Link>
            </div>

            {/* 桌面端导航菜单 */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      relative flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }
                    `}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-blue-500 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* 右侧操作区 */}
            <div className="flex items-center space-x-2">
              {/* 状态指示器 */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>在线</span>
              </div>

              {/* 设置按钮 */}
              <button className="hidden sm:block p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>

              {/* 移动端菜单按钮 */}
              <MobileMenuButton
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </div>
        </div>

        {/* 移动端导航菜单 */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden bg-white border-t border-gray-100`}
        >
          <div className="container-custom py-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {isActive && <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 移动端菜单遮罩 */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0  bg-opacity-25 z-40 md:hidden" onClick={closeMobileMenu} />
      )}
    </>
  );
};

// 面包屑导航组件
const Breadcrumb: React.FC<{ items: { label: string; path?: string }[] }> = ({ items }) => (
  <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
    <Link to="/" className="hover:text-gray-700 transition-colors">
      首页
    </Link>
    {items.map((item, index) => (
      <React.Fragment key={index}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {item.path ? (
          <Link to={item.path} className="hover:text-gray-700 transition-colors">
            {item.label}
          </Link>
        ) : (
          <span className="text-gray-900 font-medium">{item.label}</span>
        )}
      </React.Fragment>
    ))}
  </nav>
);

// 页面容器组件
const PageContainer: React.FC<{
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  breadcrumbs?: { label: string; path?: string }[];
}> = ({ children, breadcrumbs }) => {
  return (
    <div className="container-custom py-8">
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

// 路由页面组件
const HomePage: React.FC = () => (
  <PageContainer>
    <div className="p-8">
      <AdvancedCacheDemo />
    </div>
  </PageContainer>
);

const App1Page: React.FC = () => (
  <PageContainer breadcrumbs={[{ label: '子应用 App1' }]}>
    <div className="micro-app-wrapper min-h-[600px]">
      <RemoteApp1 />
    </div>
  </PageContainer>
);

const App2Page: React.FC = () => (
  <PageContainer breadcrumbs={[{ label: '子应用 App2' }]}>
    <div className="micro-app-wrapper min-h-[600px]">
      <RemoteApp2 />
    </div>
  </PageContainer>
);

// 主应用组件
export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/app1" element={<App1Page />} />
            <Route path="/app2" element={<App2Page />} />
          </Routes>
        </main>

        {/* 页脚 */}
        <footer className="bg-white border-t border-gray-200 ">
          <div className="container-custom py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <span className="text-gray-600 text-sm">© 2025 微前端平台. 保留所有权利.</span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <a href="#" className="hover:text-gray-700 transition-colors">
                  文档
                </a>
                <a href="#" className="hover:text-gray-700 transition-colors">
                  支持
                </a>
                <a href="#" className="hover:text-gray-700 transition-colors">
                  更新日志
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};
