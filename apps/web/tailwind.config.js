/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx,styl}',
    // 如果需要扫描子应用的组件，可以添加以下路径
    // "../../packages/**/*.{js,ts,jsx,tsx}", // 如果有共享组件包
  ],
  darkMode: 'class', // 或者 'media' 或 false 以禁用暗模式
  safelist: [
    // 确保所有使用的类名都被包含
    'from-pink-500',
    'to-purple-500',
    'from-pink-400',
    'to-purple-400',
    'from-purple-500',
    'to-blue-500',
    'from-purple-400',
    'to-blue-400',
    'from-blue-500',
    'to-teal-500',
    'from-blue-400',
    'to-teal-400',
    'from-teal-500',
    'to-green-500',
    'from-teal-400',
    'to-green-400',
    'from-green-500',
    'to-emerald-500',
    'from-green-400',
    'to-emerald-400',
    'from-orange-500',
    'to-red-500',
    'from-orange-400',
    'to-red-400',

    // 悬停阴影效果
    'group-hover:shadow-pink-500/25',
    'group-hover:shadow-pink-400/25',
    'group-hover:shadow-purple-500/25',
    'group-hover:shadow-purple-400/25',
    'group-hover:shadow-blue-500/25',
    'group-hover:shadow-blue-400/25',
    'group-hover:shadow-teal-500/25',
    'group-hover:shadow-teal-400/25',
    'group-hover:shadow-green-500/25',
    'group-hover:shadow-green-400/25',
    'group-hover:shadow-orange-500/25',
    'group-hover:shadow-orange-400/25',

    // 边框效果
    'hover:border-pink-500/50',
    'hover:border-pink-400/50',
    'hover:border-purple-500/50',
    'hover:border-purple-400/50',
    'hover:border-blue-500/50',
    'hover:border-blue-400/50',
    'hover:border-teal-500/50',
    'hover:border-teal-400/50',
    'hover:border-green-500/50',
    'hover:border-green-400/50',
    'hover:border-orange-500/50',
    'hover:border-orange-400/50',

    // 网格布局
    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-3',
    'md:grid-cols-2',
    'md:grid-cols-3',
    'lg:grid-cols-3',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'grid-pattern':
          "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e\")",
        'grid-pattern-light':
          "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(0 0 0 / 0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e\")",
      },
    },
  },
  plugins: [
    // 可以添加常用插件
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
};
