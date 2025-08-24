import React, { Suspense } from 'react';

// ✅ 直接用插件语法：import('app2/App')
//   不要自己手写 loadRemote，也不要用 deprecated 的 init()
const RemoteApp2 = React.lazy(() => import('app2/App'));

export default function RemoteApp2Host() {
  return (
    <Suspense fallback={<div>Loading App2…</div>}>
      <RemoteApp2 />
    </Suspense>
  );
}
