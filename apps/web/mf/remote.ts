export const remotes = (env: Record<string, string>) => {
  // 添加类型检查以确保环境变量存在
  if (!env.VITE_REMOTE_APP1 || !env.VITE_REMOTE_APP2) {
    throw new Error('Missing remote app environment variables');
  }
  return {
    app1: {
      name: 'app1',
      type: 'module' as const,
      entry: env.VITE_REMOTE_APP1,
    },
    app2: {
      name: 'app2',
      type: 'module' as const,
      entry: env.VITE_REMOTE_APP2,
    },
  };
};

// 可选：导出类型
export type RemoteConfig = ReturnType<typeof remotes>;
export type RemoteApp = ReturnType<typeof remotes>[keyof ReturnType<typeof remotes>];
