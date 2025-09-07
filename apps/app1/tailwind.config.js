/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx,styl}',
    // 如果需要扫描子应用的组件，可以添加以下路径
    // "../../packages/**/*.{js,ts,jsx,tsx}", // 如果有共享组件包
  ],
  theme: {
    extend: {
      // 可以在这里添加自定义主题配置
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
    },
  },
  plugins: [
    // 可以添加常用插件
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
};
