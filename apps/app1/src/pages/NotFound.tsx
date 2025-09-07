import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Avatar } from '@heroui/react';

/**
 * 404页面组件
 */
const NotFound: React.FC = () => {
  return (
    <div>
      <div className="flex justify-center items-center min-h-[70vh]">
        <Card className="max-w-md w-full p-8 rounded-2xl shadow-xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 overflow-hidden relative">
          {/* 装饰元素 */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-red-50 rounded-full blur-2xl" />

          <div className="text-center space-y-8 relative z-10">
            <div className="inline-block p-6 bg-red-50 rounded-full">
              <Avatar className="text-6xl bg-red-100 text-red-600 w-28 h-28">🚫</Avatar>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 mb-3">
                404
              </h1>
              <h2 className="text-2xl font-semibold text-gray-800">页面未找到</h2>
            </div>
            <p className="text-gray-600 leading-relaxed px-4">
              抱歉，您访问的页面不存在或已被移动。请检查URL是否正确，或者返回首页继续浏览。
            </p>
            <Button
              as={Link}
              to="/"
              size="lg"
              className="px-8 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              返回首页
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
