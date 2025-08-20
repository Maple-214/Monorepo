import React, { useEffect, useState } from 'react';
import { loadRemote } from '@module-federation/enhanced/runtime';

export default function RemoteApp1() {
  const [Comp, setComp] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    async function load() {
      try {
        // 直接加载远程模块
        const mod = await loadRemote('app1/App');
        setComp(() => mod.default);
      } catch (err) {
        console.error('[MF] load app1 failed', err);
      }
    }
    load();
  }, []);

  if (!Comp) return <div>Loading remote app1...</div>;
  return <Comp />;
}
