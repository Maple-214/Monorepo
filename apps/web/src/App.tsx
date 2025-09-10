import React, { useEffect, useState } from 'react';
import { HeroUIProvider } from '@heroui/react';
import {
  Footer,
  Header,
  CTASection,
  CodeExampleSection,
  HeroSection,
  FeaturesSection,
} from './components/home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App1Page from './RemoteApp1';
import App2Page from './RemoteApp2';
import { DocsPage } from './components/docs';

// 导入全局样式
import './styles/globals.css';

export const App: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // 如果没有本地存储的主题，则默认为浅色模式
    if (!localStorage.getItem('theme')) {
      return false;
    }
    // 初始化时读取 localStorage
    return localStorage.getItem('theme') === 'dark';
  });

  // 切换主题
  const toggleTheme = () => {
    setIsDark((prev) => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  // 应用到 body class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const HomePage = () => {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <HeroSection isDark={isDark} />
        <FeaturesSection isDark={isDark} />
        <CodeExampleSection isDark={isDark} />
        <CTASection isDark={isDark} />
      </div>
    );
  };

  return (
    <BrowserRouter>
      <HeroUIProvider>
        <main className="flex-1">
          <Header isDark={isDark} toggleTheme={toggleTheme} />
          <section className="mt-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/app1" element={<App1Page />} />
              <Route path="/app2" element={<App2Page />} />
              <Route path="/blog" element={<DocsPage />} />
            </Routes>
          </section>
          <Footer isDark={isDark} />
        </main>
      </HeroUIProvider>
    </BrowserRouter>
  );
};
