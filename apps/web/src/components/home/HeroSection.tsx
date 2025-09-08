import React from 'react';
import { Icons } from './IconSvgs';
import styles from './HeroSection.module.styl';
import clsx from 'clsx';

interface HeroSectionProps {
  isDark: boolean;
}
const githubUrl = 'https://github.com/Maple-214/Monorepo';
const githubHome = 'https://github.com/Maple-214';

export default function HeroSection({ isDark }: HeroSectionProps) {
  return (
    <section
      className={`min-h-screen flex flex-col mt-16 items-center justify-center text-center px-6 ${
        isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'
      } transition-colors duration-300`}
    >
      {/* 背景效果 */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-gradient-radial from-purple-900/20 via-transparent to-transparent'
            : 'bg-gradient-radial from-purple-200/30 via-transparent to-transparent'
        }`}
      ></div>

      <div className={`absolute inset-0 ${isDark ? 'opacity-20' : 'opacity-10'}`}>
        <div
          className={`h-full w-full ${isDark ? 'bg-grid-pattern' : 'bg-grid-pattern-light'}`}
        ></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* 徽章 */}
        {/* <div className={`inline-flex items-center px-3 py-1 rounded-full border ${isDark
            ? "bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-pink-500/20"
            : "bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/30"
          }`}>
          <span className={`text-sm ${isDark ? "text-pink-300" : "text-pink-600"
            }`}>✨ Turborepo 2.0 is here</span>
        </div> */}

        {/* 主标题 */}
        <h1 className="text-3xl text-center md:text-7xl leading-tight">
          <img
            className="w-full h-full"
            src="https://readme-typing-svg.herokuapp.com?font=Architects+Daughter&color=%2338C2FF&size=50&center=true&vCenter=true&height=100&width=600&lines=路漫漫+其修远兮~~~;吾将+上下+而求索!!!"
            alt=""
          />
          {/* <span className={`bg-clip-text text-transparent ${isDark
            ? "bg-gradient-to-r from-white via-gray-200 to-gray-400"
            : "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900"
            }`}>
            路漫漫 其修远兮
          </span>
          <br /> */}
          {/* <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            吾将 上下而求索
          </span> */}
        </h1>

        {/* 副标题 */}
        {/* <p className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"
          }`}>
          My journey is so hard and nearly endless.
          I will keep going forward until I get to the end in someday.
        </p> */}
        <p
          className={`text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent`}
        >
          My journey is so hard and nearly endless.
          <br />I will keep going forward until I get to the end in someday.
        </p>
        <br />

        {/* CTA 按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={githubUrl}
            target="_blank"
            className="group bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center space-x-2"
          >
            <span>开始使用</span>
            <div className="group-hover:translate-x-1 transition-transform">
              <Icons.ArrowRight />
            </div>
          </a>
          <a
            href={githubHome}
            target="_blank"
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 border ${
              isDark
                ? 'bg-gray-800 hover:bg-gray-700 text-white border-gray-600 hover:border-gray-500'
                : 'bg-white hover:bg-gray-100 text-gray-900 border-gray-300 hover:border-gray-400'
            }`}
          >
            在 Github 上查看更多
          </a>
        </div>

        {/* 统计数据 */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 ${
            isDark ? 'border-t border-gray-800' : 'border-t border-gray-200'
          }`}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-400">10x</div>
            <div className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Faster builds
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">15k+</div>
            <div className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>GitHub stars</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">1M+</div>
            <div className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Weekly downloads
            </div>
          </div>
        </div>
      </div>

      {/* 滚动指示器 */}
      <div className="mt-2">
        <div className={clsx(styles['animate-bounce'])}>
          <div className={clsx(styles['chevron'], 'text-gray-400 ')}>
            <Icons.ChevronRight />
          </div>
        </div>
      </div>
    </section>
  );
}
