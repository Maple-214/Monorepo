import React, { Suspense } from 'react';

// ✅ 直接用插件语法：import('app1/App')
//   不要自己手写 loadRemote，也不要用 deprecated 的 init()
const RemoteApp1 = React.lazy(() => import('app1/App'));

export default function RemoteApp1Host() {
  return (
    <Suspense fallback={<div>Loading App1…</div>}>
      <RemoteApp1 />
    </Suspense>
  );
}
