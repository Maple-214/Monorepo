import React from 'react';
interface CodeExampleSectionProps {
  isDark: boolean;
}

export default function CodeExampleSection({ isDark }: CodeExampleSectionProps) {
  return (
    <section className={`py-20 px-6 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              几秒内就能开始~
            </span>
          </h2>
          <p className="text-xl text-gray-400">使用单个命令将 Monorepo 添加到本地</p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-gray-400 text-sm">terminal</span>
          </div>
          <div className="font-mono text-sm space-y-2">
            <div className="text-gray-400">
              $ git clone https://github.com/Maple-214/Monorepo.git
            </div>
            <div className="text-green-400">✓ Created a new Monorepo at "./Monorepo"</div>
            <div className="text-gray-400">$ cd Monorepo</div>
            <div className="text-gray-400">$ pnpm install</div>
            <div className="text-gray-400">$ cd apps/web && pnpm run dev</div>
            <div className="text-blue-400">$ Local: http://localhost:5173/</div>
            <div className="text-gray-400">$ cd apps/app1 && pnpm run dev</div>
            <div className="text-blue-400">$ Local: http://localhost:5001/</div>
            <div className="text-gray-400">$ cd apps/app1 && pnpm run dev</div>
            <div className="text-blue-400">$ Local: http://localhost:5002/</div>
            <div className="text-pink-400">● apps/web:build: cached, replayed in 52ms</div>
            <div className="text-purple-400">● packages/ui:build: cached, replayed in 35ms</div>
            <div className="text-green-400 flex items-center">✓ Build completed in 127ms</div>
          </div>
        </div>
      </div>
    </section>
  );
}
