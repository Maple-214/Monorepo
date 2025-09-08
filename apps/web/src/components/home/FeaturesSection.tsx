import React from 'react';
import { Icons } from './IconSvgs';

interface FeaturesSectionProps {
  isDark: boolean;
}

interface FeatureCardProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  hoverColor: string;
  isDark: boolean;
}

// 颜色映射对象 - 修复所有颜色类名
const colorClasses = {
  pink: {
    gradientDark: 'from-pink-500 to-purple-500',
    gradientLight: 'from-pink-400 to-purple-400',
    hoverShadowDark: 'group-hover:shadow-pink-500/25',
    hoverShadowLight: 'group-hover:shadow-pink-400/25',
    borderDark: 'hover:border-pink-500/50',
    borderLight: 'hover:border-pink-400/50',
    text: 'text-pink-500',
  },
  purple: {
    gradientDark: 'from-purple-500 to-blue-500',
    gradientLight: 'from-purple-400 to-blue-400',
    hoverShadowDark: 'group-hover:shadow-purple-500/25',
    hoverShadowLight: 'group-hover:shadow-purple-400/25',
    borderDark: 'hover:border-purple-500/50',
    borderLight: 'hover:border-purple-400/50',
    text: 'text-purple-500',
  },
  blue: {
    gradientDark: 'from-blue-500 to-teal-500',
    gradientLight: 'from-blue-400 to-teal-400',
    hoverShadowDark: 'group-hover:shadow-blue-500/25',
    hoverShadowLight: 'group-hover:shadow-blue-400/25',
    borderDark: 'hover:border-blue-500/50',
    borderLight: 'hover:border-blue-400/50',
    text: 'text-blue-500',
  },
  teal: {
    gradientDark: 'from-teal-500 to-green-500',
    gradientLight: 'from-teal-400 to-green-400',
    hoverShadowDark: 'group-hover:shadow-teal-500/25',
    hoverShadowLight: 'group-hover:shadow-teal-400/25',
    borderDark: 'hover:border-teal-500/50',
    borderLight: 'hover:border-teal-400/50',
    text: 'text-teal-500',
  },
  green: {
    gradientDark: 'from-green-500 to-emerald-500',
    gradientLight: 'from-green-400 to-emerald-400',
    hoverShadowDark: 'group-hover:shadow-green-500/25',
    hoverShadowLight: 'group-hover:shadow-green-400/25',
    borderDark: 'hover:border-green-500/50',
    borderLight: 'hover:border-green-400/50',
    text: 'text-green-500',
  },
  orange: {
    gradientDark: 'from-orange-500 to-red-500',
    gradientLight: 'from-orange-400 to-red-400',
    hoverShadowDark: 'group-hover:shadow-orange-500/25',
    hoverShadowLight: 'group-hover:shadow-orange-400/25',
    borderDark: 'hover:border-orange-500/50',
    borderLight: 'hover:border-orange-400/50',
    text: 'text-orange-500',
  },
};

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  // gradientFrom,
  // gradientTo,
  hoverColor,
  isDark,
}: FeatureCardProps) => {
  const colorClass = colorClasses[hoverColor as keyof typeof colorClasses];

  return (
    <div
      className={`group p-6 rounded-xl border transition-all duration-300 hover:transform hover:scale-105 ${
        isDark
          ? `bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-800 ${colorClass.borderDark}`
          : `bg-gradient-to-br from-gray-50 to-gray-100/50 border-gray-200 ${colorClass.borderLight}`
      }`}
    >
      <div
        className={`w-12 h-12 bg-gradient-to-br rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg transition-all ${
          isDark
            ? `${colorClass.gradientDark} ${colorClass.hoverShadowDark}`
            : `${colorClass.gradientLight} ${colorClass.hoverShadowLight}`
        }`}
      >
        <div className="text-white">
          <Icon />
        </div>
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
        {title}
      </h3>
      <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{description}</p>
    </div>
  );
};

export default function FeaturesSection({ isDark }: FeaturesSectionProps) {
  const features = [
    {
      icon: Icons.Zap,
      title: 'Incremental Builds',
      description:
        "Never rebuild the same code twice. Turborepo remembers what you've built and skips the work that's already been done.",
      gradientFrom: 'pink',
      gradientTo: 'purple',
      hoverColor: 'pink',
    },
    {
      icon: Icons.Package,
      title: 'Smart Caching',
      description:
        'Remote caching capabilities that work across your entire team and CI/CD pipeline for maximum efficiency.',
      gradientFrom: 'purple',
      gradientTo: 'blue',
      hoverColor: 'purple',
    },
    {
      icon: Icons.GitBranch,
      title: 'Parallel Execution',
      description:
        'Run tasks across multiple packages in parallel, automatically handling dependencies and topological ordering.',
      gradientFrom: 'blue',
      gradientTo: 'teal',
      hoverColor: 'blue',
    },
    {
      icon: Icons.Clock,
      title: 'Zero Configuration',
      description:
        'Get started immediately with sensible defaults. No complex configuration needed to start seeing benefits.',
      gradientFrom: 'teal',
      gradientTo: 'green',
      hoverColor: 'teal',
    },
    {
      icon: Icons.CheckCircle,
      title: 'Proven Scale',
      description:
        'Used by teams at Vercel, Netflix, and thousands of other companies to manage codebases at massive scale.',
      gradientFrom: 'green',
      gradientTo: 'emerald',
      hoverColor: 'green',
    },
    {
      icon: Icons.Layers,
      title: 'Framework Agnostic',
      description:
        'Works with any JavaScript framework or build tool. Integrate seamlessly with your existing workflow.',
      gradientFrom: 'orange',
      gradientTo: 'red',
      hoverColor: 'orange',
    },
  ];

  return (
    <section
      className={`py-20 px-6 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span
              className={`bg-clip-text text-transparent ${
                isDark
                  ? 'bg-gradient-to-r from-white to-gray-300'
                  : 'bg-gradient-to-r from-gray-700 to-gray-500'
              }`}
            >
              其他优秀项目预览
            </span>
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            展示一些其他优秀的项目，以供参考。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  );
}
