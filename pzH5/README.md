# 陪诊服务系统 · 用户端 H5（pzh5）

陪诊（陪护）服务的移动端 H5，覆盖「浏览医院 → 填写陪诊订单 → 扫码支付 → 查看订单状态 → 订单详情」的完整闭环。

## 技术栈

| 分类 | 选型 |
|---|---|
| 框架 | Vue 3（`<script setup>` 组合式 API） |
| 构建 | Vite 8（开发端口 5500） |
| UI | Vant 4（`unplugin-auto-import` + `@vant/auto-import-resolver` 按需引入） |
| 路由 | Vue Router（hash 模式） |
| 其他 | Axios、qrcode（前端生成支付二维码）、Less |

## 功能清单

| 页面 | 路由 | 说明 |
|---|---|---|
| 登录 | `/login` | 账号密码登录，成功写入 `h5_token` / `h5_userInfo` |
| 首页 | `/home` | 轮播、快捷入口、医院列表；搜索框做**本地关键词过滤** |
| 填写订单 | `/createOrder` | 选择医院、就诊时间、陪诊师，填写接送地址/联系电话/服务需求，提交后弹窗展示微信支付二维码 |
| 订单列表 | `/order` | 按状态 Tab 筛选（全部/待支付/待服务/已完成/已取消），待支付订单显示倒计时 |
| 订单详情 | `/detail` | 状态进度条、预约信息、订单信息、支付倒计时与二维码 |
| 我的 | `/user` | 用户信息、各状态订单入口、退出登录 |

订单状态与进度条映射：`待支付 10 / 待服务 20 / 已完成 30 / 已取消 40`。

## 目录结构

```
src
├── api            # 接口定义
├── components     # counter.vue（倒计时）/ statusBar.vue（状态进度条）
├── pages          # Main.vue（底部 tabbar 布局）+ 各业务页面
├── router         # 路由表 + 登录守卫
├── utils          # request.js（axios 封装）、format.js（时间格式化、倒计时、支付超时）
└── main.js
```

## 快速开始

```bash
npm install
npm run dev      # http://localhost:5500
npm run build
npm run preview
```

接口地址通过环境变量注入（见 `.env.development`、`.env.production`）：

```
VITE_API_BASE=https://v3pz.itndedu.com/v3pz
```

## 关键实现说明

### 1. 网络层（`utils/request.js`）

- 实例统一配置 `baseURL`（读环境变量）、`timeout` 与 `terminal: h5` 请求头；
- 请求拦截：非白名单接口带 `h-token`（白名单按去掉 query 后的路径匹配）；
- 响应拦截：`code === -1` 冒泡业务提示；`code === -2` 清缓存并整页重载，标志位保证并发只处理一次；超时与网络异常分别提示。

### 2. 倒计时组件（`components/counter.vue`）

- 记录**截止时间戳**，每秒用 `Date.now()` 反算剩余时间，避免切后台后定时器被降频导致越走越偏；
- 监听 `props.second` 变化重新计时，`onBeforeUnmount` 清理定时器，不会泄漏；
- 归零时 `emit('counterOver')`，展示文案由 `utils/format.js` 的 `formatCountdown` 统一生成。

### 3. 支付流程

下单接口返回支付链接（`wx_code`），前端用 `qrcode` 生成二维码在弹窗中展示；提交按钮带 `loading` 且请求期间禁用，避免重复下单。

### 4. 支付超时时间

目前按「下单后 2 小时」的约定在前端计算（`utils/format.js` 的 `PAYMENT_TIMEOUT_MS`）。**后端若下发过期时间或剩余秒数，只需改这一处**，不要把魔法数字散落在页面里。

### 5. 登录态

路由守卫统一校验：未登录只能进 `/login`，已登录不再停留在登录页；接口返回登录失效时清缓存并回到登录流程。

## 已知问题与后续计划

- 移动端适配目前是固定 px（375 设计稿），未做 vw/rem 等比缩放，也**未处理刘海屏安全区**（`env(safe-area-inset-bottom)`）与 `100vh` 在 iOS 键盘弹出时的抖动；
- 支付结果依赖用户手动返回，未做轮询/推送确认支付成功；
- 「我的」页面中的服务对象管理、分享转发为占位入口；
- 待补充：图片懒加载（`van-image` 的 `lazy-load`）、列表触底加载/虚拟列表、ESLint + Prettier、单元测试。

> 本仓库是双端陪诊系统的**用户端 H5**，运营后台见同系列的 `pzadmin` 项目。
