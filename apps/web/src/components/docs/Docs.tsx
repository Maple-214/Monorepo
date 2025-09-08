import React from 'react';
export const DocsPage: React.FC = () => {
  console.log('import.meta.env', import.meta.env);
  return (
    <div className="h-screen">
      <iframe
        src={import.meta.env.DEV ? 'http://localhost:5003' : 'http://117.72.165.201:5003'}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Docs"
      />
    </div>
  );
};
