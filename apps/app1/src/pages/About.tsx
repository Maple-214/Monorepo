import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Avatar, Badge } from '@heroui/react';

/**
 * 关于页面组件
 * 使用HeroUI组件库创建现代化、美观的关于页面
 */
const About: React.FC = () => {
  // 技术栈数据
  const techStack = [
    { name: 'React', version: '18+', icon: '⚛️', color: 'blue' },
    { name: 'Vite', version: '5+', icon: '⚡', color: 'yellow' },
    { name: 'React Router DOM', version: '7+', icon: '🔀', color: 'purple' },
    { name: 'TypeScript', version: '5+', icon: '📝', color: 'blue' },
    { name: 'HeroUI', version: '2.8.3', icon: '🎨', color: 'pink' },
    { name: 'Module Federation', version: 'N/A', icon: '🔄', color: 'green' },
  ];

  // 特性数据
  const features = [
    '基于 Hash 模式的路由系统',
    '现代化 UI 设计，基于 HeroUI 组件库',
    '响应式布局，适配不同设备尺寸',
    '支持独立运行和微前端集成',
    'TypeScript 类型安全',
    '优化的构建配置',
  ];

  // 获取技术栈卡片的颜色样式
  const getTechColor = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-600' },
      default: { bg: 'bg-primary/10', text: 'text-primary' },
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.default;
  };

  return (
    <div>
      {/* 页面标题 */}
      <div className="text-center space-y-6 mb-10">
        <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
          <Avatar className="text-3xl bg-primary/20 text-primary w-16 h-16">📋</Avatar>
        </div>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
          关于 App1
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          这是一个基于 React 和 Vite 的子应用示例，采用现代前端技术栈构建。
        </p>
      </div>

      {/* 应用介绍卡片 */}
      <Card className="p-6 md:p-8 rounded-xl border border-gray-200 shadow-md mb-10 bg-white hover:shadow-lg transition-all">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">应用概述</h2>
        <p className="text-gray-600 leading-relaxed">
          App1 是一个演示型子应用，展示了在 Monorepo 架构中如何使用 React、Vite 和 Module Federation
          构建可独立部署、可共享组件的微前端应用。 该应用采用 Hash
          模式路由，支持独立运行和作为主应用的一部分嵌入运行。通过 HeroUI
          组件库，提供了现代化、美观的用户界面。
        </p>
      </Card>

      {/* 技术栈卡片 */}
      <Card className="p-6 md:p-8 rounded-xl border border-gray-200 shadow-md mb-10 bg-white hover:shadow-lg transition-all">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">技术栈</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {techStack.map((tech, index) => {
            const color = getTechColor(tech.color);
            return (
              <Card
                key={index}
                className="p-5 flex items-center gap-4 hover:shadow-md transition-all border border-gray-100 bg-white rounded-lg"
              >
                <Avatar className={`${color.bg} ${color.text} w-12 h-12 text-xl`}>
                  {tech.icon}
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{tech.name}</h3>
                  <Badge className="mt-1 bg-gray-100 text-gray-700">{tech.version}</Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      {/* 特性卡片 */}
      <Card className="p-6 md:p-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 shadow-md mb-10 hover:shadow-lg transition-all">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">核心特性</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-white/60 rounded-lg border border-indigo-100"
            >
              <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full">
                <span className="text-sm">✓</span>
              </div>
              <p className="text-gray-700">{feature}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* 返回按钮 */}
      <div className="flex justify-center mb-6">
        <Button
          as={Link}
          to="/"
          size="lg"
          className="px-8 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium transition-all shadow-md hover:shadow-lg"
        >
          返回首页
        </Button>
      </div>
    </div>
  );
};

export default About;
