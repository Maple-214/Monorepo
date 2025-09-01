// test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// 不需要额外的 BrowserRouter，因为 App 组件内部已经有路由了
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  return render(ui, options);
};

export { customRender as render };
