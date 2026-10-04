# 陪诊服务系统 · 运营管理后台（pzadmin）

陪诊（陪护）服务系统的运营侧后台，负责陪护师管理、订单管理与账号权限配置。
**页面不是写死在路由表里的**：登录后由后端下发当前账号可见的权限菜单，前端动态注册路由。

## 技术栈

| 分类 | 选型 |
|---|---|
| 框架 | Vue 3（`<script setup>` 组合式 API） |
| 构建 | Vite 8 |
| 路由 | Vue Router 4（hash 模式） |
| 状态 | Vuex 4 + vuex-persistedstate |
| UI | Element Plus（`unplugin-auto-import` + `unplugin-vue-components` 按需引入） |
| 其它 | Axios、Day.js、Less |

## 功能清单

| 模块 | 说明 |
|---|---|
| 登录 / 注册 | 手机号与密码格式校验、短信验证码 60s 倒计时、登录/注册表单切换 |
| 动态权限菜单 | 登录后拉取权限菜单树，映射为懒加载组件并动态注册路由，刷新后自动重建 |
| 陪护师管理 | 分页列表、新增/编辑（昵称、头像选择、性别、年龄、手机号、生效状态）、多选删除 |
| 订单管理 | 分页列表、按订单号搜索、状态标签、待服务订单可「服务完成」 |
| 账号管理 | 账号列表、为账号分配权限组 |
| 菜单权限管理 | `el-tree` 勾选权限点，提交权限 id 集合 |
| 通用交互 | 侧边栏折叠、递归树形菜单、多标签页（可关闭）导航、404 兜底页 |

## 目录结构

```
src
├── api             # 接口定义（具名导出，页面不直接写 URL）
├── components      # 布局级组件：aside / treeMenu（递归菜单）/ navHeader（多标签）/ panelHead
├── router          # 静态路由（登录、布局、404 兜底）
├── store           # Vuex：menu 模块（动态菜单、已打开标签、折叠状态）
├── utils           # request.js：axios 实例与请求/响应拦截器
└── views           # 页面：login / auth（账号、菜单权限）/ vppz（陪护师、订单）/ error
```

## 快速开始

```bash
npm install
npm run dev      # 开发环境
npm run build    # 生产构建
npm run preview  # 预览构建产物
```

接口地址通过环境变量注入（见 `.env.development`、`.env.production`）：

```
VITE_API_BASE=https://v3pz.itndedu.com/v3pz
```

## 关键实现说明

### 1. 动态路由 + 权限菜单（核心）

1. 登录成功后请求权限菜单树（含 `meta.path`、`meta.icon`、`meta.name`、`meta.describe`）；
2. `store/menu.js` 的 `dynamicMenu` 用 `import.meta.glob('../views/**/*.vue')` 按 `meta.path` 拼出组件路径并映射为**懒加载函数**，映射不到时用 404 页面兜底并 `console.warn`；
3. 把菜单树逐条 `router.addRoute('main', item)` 注册到布局路由下；
4. **刷新会丢动态路由**：组件是函数，无法被 JSON 持久化，因此启动时从 `localStorage.pz_v3pz` 取出菜单，重新执行一次 `dynamicMenu` 再注册。

新增页面时，后端把菜单 `path` 配上、前端把页面放到 `views/<path>/index.vue` 即可，不需要改前端路由表。

### 2. 网络层（`utils/request.js`）

- 请求拦截：非白名单接口自动带 `x-token`，白名单按**去掉 query 后的路径**匹配；
- 响应拦截：`code === -1` 统一弹出提示；`code === -2`（登录失效）清理缓存并整页重载，用标志位保证并发请求只触发一次；
- 区分超时（`ECONNABORTED`）与网络异常两类提示；
- 约定 `code === 10000` 为业务成功。

### 3. 布局交互

- `treeMenu.vue` 递归渲染菜单，用 `父级 index-id` 拼接保证 `el-menu` 的 `index` 唯一；
- `navHeader.vue` 维护「已打开标签」，支持关闭并自动切换到相邻标签，退出登录清空缓存。

## 已知问题与后续计划

- 目前只有**菜单级权限**，没有按钮级权限（如「服务完成」按钮未做权限点校验），安全仍需后端二次校验；
- 切换侧边菜单会重新请求数据，可引入 `keep-alive` 缓存列表页；
- 全部为 JS，未接入 TypeScript；
- 待补充：ESLint + Prettier、Vitest 单元测试、CI 流程；
- 生产部署用 hash 路由，Nginx 无需额外 rewrite 配置。

> 本仓库是双端陪诊系统的**后台端**，用户端 H5 见同系列的 `pzH5` 项目。
