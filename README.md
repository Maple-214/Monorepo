# Monorepo Model

基于 **pnpm + Turborepo** 的 Monorepo 项目示例，包含：

- `apps/web` → React 应用，使用 Vite 启动与构建
- `packages/ui` → 公共组件库（React 组件）
- `packages/utils` → 公共工具函数库
- 工程化支持：ESLint + Prettier + Husky + Commitlint + Changesets

---

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动开发环境

```bash
主站独立调试：
pnpm dev --filter web
# 打开 http://localhost:5173
子站独立调试：
pnpm dev --filter app1
# 打开 http://localhost:5001
主站集成子站（只启动需要的子站）：
pnpm dev --filter app1
pnpm dev --filter web
# 主站会按 remotes.json 载入已启动的 app1
```

### 3. 构建项目

构建整个 Monorepo：

```bash
pnpm turbo run build
```

仅构建 web 应用：

```bash
pnpm build --filter web
```

构建某个子包（例如 ui）：

```bash
pnpm build --filter @anmx/ui
```

---

## 📦 项目结构

```
.
monorepo-model/
├── apps
│   ├── web                 # 主应用 (React + Vite + Module Federation Host)
│   │   ├── public
│   │   │   └── index.html
│   │   ├── src
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── pages/...
│   │   ├── vite.config.ts
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── app1                # 子应用1 (Remote, 可独立运行)
│   │   ├── public
│   │   │   └── index.html
│   │   ├── src
│   │   │   ├── App.tsx
│   │   │   ├── bootstrap.tsx
│   │   │   └── pages/...
│   │   ├── vite.config.ts
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   └── app2                # 子应用2 (Remote, 可独立运行)
│       ├── public
│       │   └── index.html
│       ├── src
│       │   ├── App.tsx
│       │   ├── bootstrap.tsx
│       │   └── pages/...
│       ├── vite.config.ts
│       ├── package.json
│       └── Dockerfile
│
├── packages
│   ├── ui                  # 公共组件库
│   │   ├── src
│   │   │   ├── Button.tsx
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── utils               # 工具函数库
│       ├── src
│       │   ├── format.ts
│       │   └── index.ts
│       ├── tsconfig.json
│       └── package.json
│
├── deploy
│   ├── nginx.conf          # 通用 Nginx 配置
│   └── docker-compose.yml  # (可选) 本地一键运行
│
├── .husky                  # Git Hooks (pre-commit, commit-msg)
├── .changeset              # Changesets 配置
├── .eslintrc.json          # ESLint 配置
├── .prettierrc             # Prettier 配置
├── turbo.json              # Turborepo 配置
├── pnpm-workspace.yaml     # pnpm 工作区声明
├── package.json            # 根依赖配置
└── README.md               # 项目说明文档


```

---

## 🛠️ 工程规范

### 代码风格

- 使用 **ESLint + Prettier** 保持代码一致性
- 提交前会自动运行 lint-staged，校验代码规范

运行：

```bash
pnpm lint
pnpm format
```

### Git 提交规范

- 使用 **Commitlint** 检查提交信息
- 使用 Conventional Commits 规范

示例：

```
feat(ui): 新增 Button 组件
fix(utils): 修复格式化函数在小数时的精度问题
```

常见类型：

- feat: 新功能
- fix: 修复 bug
- docs: 文档更新
- style: 代码风格（空格、格式化等）
- refactor: 重构
- test: 测试
- chore: 其他改动

### 版本与发布

- 使用 **Changesets** 管理版本与变更日志

生成变更集：

```bash
pnpm changeset
```

更新版本：

```bash
pnpm changeset version
pnpm install
```

发布：

```bash
pnpm publish -r
```

---

## 🔧 开发模式配置

在 `apps/web/vite.config.ts` 中，alias 始终指向 `src`，避免开发与构建时切换路径带来的维护负担：

```ts
resolve: {
  alias: {
    "@anmx/ui": path.resolve(__dirname, "../../packages/ui/src"),
    "@anmx/utils": path.resolve(__dirname, "../../packages/utils/src"),
  },
},
```

这样在开发时可直接使用源码，保持调试体验。

---

## 📖 技术栈

- pnpm → 包管理 & 工作区
- Turborepo → 任务调度 & 缓存
- React + Vite → 前端应用框架
- ESLint + Prettier → 代码规范
- Husky + Lint-staged → Git Hook 校验
- Commitlint + Changesets → 提交与版本管理

---

## ⚙️ 常见命令清单

| 命令                            | 说明                |
| ------------------------------- | ------------------- |
| `pnpm install`                  | 安装依赖            |
| `pnpm dev --filter web`         | 启动 Web 应用       |
| `pnpm turbo run build`          | 构建所有包          |
| `pnpm build --filter <package>` | 构建指定包          |
| `pnpm turbo run test`           | 运行所有测试        |
| `pnpm lint`                     | 代码检查            |
| `pnpm format`                   | 格式化代码          |
| `pnpm typecheck`                | TypeScript 类型检查 |
| `pnpm changeset`                | 创建变更集          |
| `pnpm publish -r`               | 发布所有包          |

---

## 📌 TODO

- [x] 集成微前端
- [x] CI/CD 配置（GitHub Actions / GitLab CI）
- [ ] UI 组件库文档站点（Storybook 或 Ladle）
- [ ] 单元测试覆盖 ui 与 utils

---

## ❓ FAQ（常见问题排查）

### 1. 启动时提示 `Failed to resolve entry for package "@anmx/ui"`

原因：Vite 找不到包的入口文件。  
解决方法：

- 确认 `apps/web/vite.config.ts` 的 alias 已经正确指向 `../../packages/ui/src`
- 如果是生产构建，请先构建 `ui` 包：
  ```bash
  pnpm build --filter @anmx/ui
  ```

---

### 2. 提交代码时提示 `husky - install command is DEPRECATED`

原因：husky v9 起弃用了旧的安装命令。  
解决方法：

- 使用 `pnpm dlx husky init` 初始化 hooks
- 或手动在 `.husky` 下创建 hook 脚本文件

---

### 3. `pnpm add` 报错：`ERR_PNPM_ADDING_TO_ROOT`

原因：pnpm 默认不允许在 workspace 根目录添加依赖。  
解决方法：

- 如果依赖需要放在根目录，明确加上 `-w` 参数：
  ```bash
  pnpm add -Dw <package>
  ```
- 如果依赖属于某个子包，进入子包目录再执行 `pnpm add`

---

### 4. Turborepo 提示 `Found "pipeline" field instead of "tasks"`

原因：Turborepo 2.0 之后将 `pipeline` 改名为 `tasks`。  
解决方法：

- 修改 `turbo.json`：
  ```json
  {
    "tasks": {
      "build": {
        "dependsOn": ["^build"],
        "outputs": ["dist/**", "types/**"]
      },
      "dev": {
        "cache": false
      }
    }
  }
  ```

---

### 5. `commitlint` 校验失败

原因：提交信息不符合 Conventional Commits 规范。  
解决方法：

- 按规范书写：
  ```
  feat(ui): 新增 Button 组件
  fix(utils): 修复格式化函数在小数时的精度问题
  ```

---

### 6. `pnpm dev --filter web` 卡住

原因：Turborepo 并行任务未退出，或子包缺少依赖。  
解决方法：

- 确认 `apps/web/package.json` 已经包含 `react`、`vite` 等依赖
- 如果依赖正常，尝试单独进入 `apps/web`，执行：
  ```bash
  pnpm dev
  ```

---

### 7. Vite 启动时报 `isDev is not defined`

原因：vite.config.ts 中使用了未定义的变量。  
解决方法：

- 在 `vite.config.ts` 顶部定义：
  ```ts
  const isDev = process.env.NODE_ENV !== 'production';
  ```

---

### 8. `lint-staged` 没有执行

原因：Husky 没有正确触发 pre-commit hook。  
解决方法：

- 确认 `.husky/pre-commit` 文件存在，并且包含：

  ```sh
  #!/bin/sh
  . "$(dirname "$0")/_/husky.sh"

  pnpm lint-staged
  ```

---

### 9. 如何只运行某个包的测试？

```bash
pnpm test --filter @anmx/utils
```

---

### 10. 如何清理依赖和缓存？

```bash
pnpm store prune
pnpm install --force
```

## 11.公共库package发版步骤

```bash
本地发版命令：
pnpm changeset → pnpm changeset version → pnpm build → pnpm changeset publish
```
