import React, { useState, useRef, useEffect } from 'react';
import { Icons } from './IconSvgs';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}
const githubUrl = 'https://github.com/Maple-214';
const navItems = [
  {
    path: '/',
    label: '首页',
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
    label: '子站一',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-8 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
  {
    path: '/app2',
    label: '子站二',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    path: '/blog',
    label: '泽枫的小屋',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
    ),
  },
];

export default function Header({ isDark, toggleTheme }: HeaderProps) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const linkClass = isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black';

  const iconClass = isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black';

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // 关闭菜单函数
  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        isDark
          ? 'bg-black/80 backdrop-blur border-b border-gray-700'
          : 'bg-white/80 backdrop-blur border-b border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* 左侧 Logo */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">ZF</span>
            </div>
            <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
              Monorepo
            </span>
          </div>

          {/* 桌面导航 */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${linkClass} ${isActive ? 'font-semibold' : ''} flex items-center space-x-1`}
                >
                  <span className="w-5 h-5">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 右侧操作区 */}
        <div className="flex items-center space-x-4">
          {/* 主题切换按钮 */}
          <button onClick={toggleTheme} className={iconClass}>
            {isDark ? <Icons.Sun /> : <Icons.Moon />}
          </button>

          {/* 社交图标 */}
          <div className="hidden md:flex items-center space-x-4">
            <a href={githubUrl} target="_blank" className={iconClass}>
              <Icons.Github />
            </a>
          </div>

          {/* 移动端菜单按钮 */}
          <button
            ref={buttonRef}
            className={`md:hidden ${iconClass}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icons.Menu />
          </button>
        </div>
      </div>

      {/* 移动端菜单 */}
      {menuOpen && (
        <div
          ref={menuRef}
          className={`md:hidden px-6 py-4 space-y-4 border-t ${
            isDark ? 'bg-black/95 border-gray-800' : 'bg-white/95 border-gray-200'
          }`}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block ${linkClass} ${isActive ? 'font-semibold' : ''} flex items-center space-x-3`}
                onClick={closeMenu}
              >
                <span className="w-5 h-5">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="flex space-x-4 mt-4 pt-4 border-t border-gray-700">
            <a href="#" className={iconClass}>
              <Icons.Github />
            </a>
            <a href="#" className={iconClass}>
              <Icons.Twitter />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
