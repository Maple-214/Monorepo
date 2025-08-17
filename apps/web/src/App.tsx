import React from 'react';
import { Button } from '@acme/ui';
import { format_currency } from '@acme/utils';

export const App: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <h1>Monorepo Starter</h1>
      <p>Price: {format_currency(199.99, 'USD')}</p>
      <Button onClick={() => alert('Hello Monorepo!')}>Click Me</Button>
    </div>
  );
};
