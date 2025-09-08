import React from 'react';
import { Icons } from './IconSvgs';

interface CTASectionProps {
  isDark: boolean;
}
const githuburl = 'https://github.com/Maple-214/Monorepo';
const githubReadMe = 'https://github.com/Maple-214/Monorepo?tab=readme-ov-file#monorepo-model';
export default function CTASection({ isDark }: CTASectionProps) {
  return (
    <section
      className={`py-20 text-center px-6 transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          <span
            className={`bg-clip-text text-transparent ${
              isDark
                ? 'bg-gradient-to-r from-white to-gray-300'
                : 'bg-gradient-to-r from-gray-700 to-gray-500'
            }`}
          >
            准备好开始上手了吗?
          </span>
        </h2>
        <p
          className={`text-xl mb-8 max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
        >
          加入成为 Monorepo 的开发者， 开始使用 Monorepo
          架构来管理你的项目，来实现更快、更高效的构建。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={githuburl}
            target="_blank"
            className="group bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center space-x-2"
          >
            <span>立刻加入</span>
            <div className="group-hover:translate-x-1 transition-transform">
              <Icons.ArrowRight />
            </div>
          </a>
          <a
            href={githubReadMe}
            target="_blank"
            className={`px-8 py-3 font-semibold transition-colors flex items-center space-x-2 rounded-lg border ${
              isDark
                ? 'text-gray-300 hover:text-white border-gray-700 hover:border-gray-500 bg-gray-800/50 hover:bg-gray-700/50'
                : 'text-gray-600 hover:text-gray-900 border-gray-300 hover:border-gray-400 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <span>阅读文档</span>
            <Icons.ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
