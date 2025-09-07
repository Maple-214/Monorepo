import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Avatar, Badge } from '@heroui/react';

/**
 * 首页组件
 * 使用HeroUI组件库创建现代化、美观的首页界面
 */
const Home: React.FC = () => {
  return (
    <div>
      {/* 页面标题和介绍 */}
      <div className="text-center space-y-6 mb-10">
        <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
          <Avatar className="text-3xl bg-primary/20 text-primary w-16 h-16">🚀</Avatar>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
          欢迎来到 App1
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          这是一个基于 React、Vite 和 HeroUI 的现代化子应用示例，提供了丰富的组件和优雅的用户界面。
        </p>
      </div>

      {/* 特性卡片区域 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <FeatureCard
          icon="⚡"
          title="高性能"
          description="基于 Vite 构建，提供极速的开发体验和优化的生产构建。"
          color="blue"
        />
        <FeatureCard
          icon="🎨"
          title="美观界面"
          description="集成 HeroUI 组件库，提供现代化、响应式的用户界面设计。"
          color="purple"
        />
        <FeatureCard
          icon="🔄"
          title="组件化架构"
          description="采用模块化设计，支持跨应用共享组件，提升开发效率。"
          color="green"
        />
      </div>

      {/* 操作区域 */}
      <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
        <Button
          as={Link}
          to="/about"
          size="lg"
          className="px-8 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium transition-all shadow-md hover:shadow-lg"
        >
          了解更多
        </Button>
        <Button
          size="lg"
          className="px-8 py-3 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-medium transition-all shadow-md hover:shadow-lg border border-gray-200"
        >
          探索功能
        </Button>
      </div>

      {/* 状态信息卡片 */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl shadow-md hover:shadow-lg transition-all">
        <div className="flex items-center gap-4 flex-wrap">
          <Avatar className="bg-primary/20 text-primary w-12 h-12">ℹ️</Avatar>
          <div className="flex-1 min-w-[200px]">
            <h3 className="font-semibold text-xl mb-2">应用状态</h3>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className="bg-green-100 text-green-800 px-3 py-1 text-sm">运行正常</Badge>
              <span className="text-sm text-gray-500">Hash 模式路由已启用</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 bg-gray-100 p-3 rounded-lg inline-block">
          <code>当前 URL 格式: http://localhost:5001/#/</code>
        </p>
      </Card>
    </div>
  );
};

/**
 * 特性卡片组件
 */
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  color: 'blue' | 'purple' | 'green';
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color }) => {
  // 根据颜色确定背景和文字颜色
  const getColorStyles = () => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50',
          bgAvatar: 'bg-blue-100',
          textAvatar: 'text-blue-600',
          border: 'border-blue-200',
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          bgAvatar: 'bg-purple-100',
          textAvatar: 'text-purple-600',
          border: 'border-purple-200',
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          bgAvatar: 'bg-green-100',
          textAvatar: 'text-green-600',
          border: 'border-green-200',
        };
      default:
        return {
          bg: 'bg-gray-50',
          bgAvatar: 'bg-primary/10',
          textAvatar: 'text-primary',
          border: 'border-gray-200',
        };
    }
  };

  const colors = getColorStyles();

  return (
    <Card
      className={`p-6 h-full border ${colors.border} ${colors.bg} hover:shadow-lg transition-all duration-300 rounded-xl transform hover:-translate-y-1`}
    >
      <div className="flex flex-col h-full">
        <Avatar className={`${colors.bgAvatar} ${colors.textAvatar} text-2xl mb-4 w-12 h-12`}>
          {icon}
        </Avatar>
        <h3 className="font-bold text-xl mb-3">{title}</h3>
        <p className="text-gray-600 flex-grow">{description}</p>
      </div>
    </Card>
  );
};

export default Home;
