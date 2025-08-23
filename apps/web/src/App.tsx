import React from 'react';
import RemoteApp1 from './RemoteApp1';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Button } from '@acme/ui';
import { format_currency } from '@acme/utils';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div style={{ padding: 24 }}>
        <h1>Monorepo Starter</h1>
        <h2>测试公共组件库引用</h2>
        <p>Price: {format_currency(199.99, 'USD')}</p>
        <Button onClick={() => alert('Hello Monorepo!')}>Click Me</Button>

        <h1>Host: Main Web</h1>
        <p>子站独立运行，不影响主站；需要时按 remotes.json 按需加载。</p>
        <RemoteApp1 />
      </div>
      <div>
        <nav style={{ padding: 16, borderBottom: '1px solid #ccc' }}>
          <Link to="/">主站首页</Link> | <Link to="/app1">子应用 App1</Link>
          <Link to="/app2">子应用 App2</Link>
        </nav>
        <Routes>
          <Route path="/" element={<h1>主站首页</h1>} />
          <Route path="/app1" element={<RemoteApp1 />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};
