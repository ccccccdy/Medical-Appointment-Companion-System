# 陪诊服务系统

一个基于 Vue 3 开发的陪诊服务双端项目，包含用户端 H5 和运营管理后台。

> 本项目用于个人学习、技术实践和求职项目展示，不建议直接用于真实医疗、支付或生产业务。

## 项目预览

本仓库包含两个前端应用：

| 应用 | 目录 | 说明 |
| --- | --- | --- |
| 用户端 H5 | [`pzH5/`](./pzH5) | 用户浏览医院、创建陪诊订单、查看订单状态和订单详情 |
| 运营管理后台 | [`admin/`](./admin) | 管理陪护师、订单、账号和菜单权限 |

## 技术栈

- Vue 3
- Vite
- Vue Router
- Axios
- Less
- 用户端：Vant 4、QRCode
- 管理后台：Element Plus、Vuex 4、vuex-persistedstate、Day.js

## 功能模块

### 用户端 H5

- 登录与登录态管理
- 首页轮播、医院列表和本地关键词搜索
- 创建陪诊订单
- 选择医院、就诊时间和陪诊师
- 填写接送地址、联系电话和服务需求
- 生成支付二维码
- 订单列表及状态筛选
- 待支付订单倒计时
- 订单详情和状态进度条
- 用户中心和退出登录

### 运营管理后台

- 登录与注册
- 基于权限菜单的动态路由
- 账号管理
- 权限组管理
- 菜单权限配置
- 陪护师列表、新增、编辑和批量删除
- 订单查询与状态管理
- 递归侧边栏菜单
- 可折叠侧边栏
- 多标签页导航
- 404 页面兜底

## 目录结构

```text
.
├── admin/                  # 运营管理后台
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
├── pzH5/                   # 用户端 H5
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
├── .gitignore
└── README.md
```

## 本地运行

### 环境要求

- Node.js 18 或更高版本
- npm 9 或更高版本

### 1. 获取项目

```bash
git clone <your-repository-url>
cd 培诊系统
```

### 2. 配置接口地址

两个子项目都提供了 `.env.example`。复制为开发环境配置后，填写可用的后端接口地址：

```powershell
Copy-Item .\admin\.env.example .\admin\.env.development
Copy-Item .\pzH5\.env.example .\pzH5\.env.development
```

配置内容：

```env
VITE_API_BASE=https://your-api.example.com/api
```

`.env.*` 文件不会提交到 Git 仓库，请勿把密码、Token 或其他密钥写入前端代码。

### 3. 启动用户端 H5

```bash
cd pzH5
npm install
npm run dev
```

默认开发端口请以终端输出为准。

### 4. 启动运营管理后台

在新的终端窗口执行：

```bash
cd admin
npm install
npm run dev
```

## 生产构建

分别在两个项目目录执行：

```bash
npm run build
```

也可以从仓库根目录执行：

```powershell
npm run build --prefix .\pzH5
npm run build --prefix .\admin
```

构建产物位于各自的 `dist/` 目录，`dist/` 不会提交到 Git 仓库。

## 核心实现

### 统一请求层

两个应用都使用 Axios 实例封装网络请求，并在拦截器中处理：

- 接口基础地址
- Token 注入
- 请求超时
- 网络异常提示
- 业务错误提示
- 登录失效后的本地登录态清理

用户端使用 `h-token`，管理后台使用 `x-token`。

### 动态菜单与动态路由

管理后台登录后从后端获取权限菜单树，使用 `import.meta.glob` 映射页面组件，并通过 `router.addRoute` 动态注册路由。菜单数据持久化后，在刷新页面时重新构建动态路由。

### 订单状态与支付流程

用户端根据订单状态展示不同的状态标签和进度条。下单接口返回支付链接后，前端使用 QRCode 生成支付二维码，并通过倒计时组件展示待支付订单的剩余时间。


## 项目来源说明

本项目是在学习和实践基础上完成的 Vue 3 双端项目。页面、组件、请求封装、订单流程、权限菜单和问题修复经过个人开发、调试和整理。公开仓库不包含课程资料目录、依赖目录、构建产物和本地环境配置文件。

## License

本项目仅用于学习和个人作品展示。若要用于商业项目，请先确认接口、图片素材、第三方依赖及相关业务合规性。
