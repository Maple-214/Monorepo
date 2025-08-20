export const loadRemoteModule = async (remoteName: string, modulePath: string) => {
  try {
    // 使用动态 import，让 Vite 插件处理联邦逻辑
    const module = await import(/* @vite-ignore */ `${remoteName}/${modulePath}`);
    return module;
  } catch (error) {
    console.error(`Failed to load ${modulePath} from ${remoteName}:`, error);
    throw error;
  }
};

// 预加载远程入口
export const preloadRemote = (remoteUrl: string) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = remoteUrl;
    script.type = 'text/javascript';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};
