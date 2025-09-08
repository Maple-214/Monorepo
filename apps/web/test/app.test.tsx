// App.test.tsx
// 导入测试所需的工具函数
import { screen } from '@testing-library/react';
// 导入要测试的 App 组件
import { App } from '../src/App1';
// 导入自定义的 render 函数（避免路由嵌套问题）
import { render } from './test-utils';

// 使用 describe 创建一个测试套件，描述要测试的功能模块
describe('App Component', () => {
  // 使用 it 定义一个具体的测试用例
  it('渲染首页和导航栏', () => {
    render(<App />);

    // 确认有2个"主站首页"元素（桌面端和移动端）
    const homeLinks = screen.getAllByText('主站首页');
    expect(homeLinks).toHaveLength(2); // 桌面端和移动端各一个

    // 验证其他导航项
    expect(screen.getAllByText('子应用 App1')).toHaveLength(2);
    expect(screen.getAllByText('子应用 App2')).toHaveLength(2);
    expect(screen.getAllByText('泽枫的空间')).toHaveLength(2);
  });
});
