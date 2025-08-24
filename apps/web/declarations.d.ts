// 定义通用类型
type RemoteApp = React.ComponentType<unknown>;

// 声明远程模块
declare module 'app1/App' {
  const App: RemoteApp;
  export default App;
}

declare module 'app2/App' {
  const App: RemoteApp;
  export default App;
}
