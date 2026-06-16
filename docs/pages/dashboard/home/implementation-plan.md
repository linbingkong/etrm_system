# 工作台首页实施方案

## 1. 页面目标

实现 `/dashboard` 工作台首页，作为山东电力交易辅助决策系统首批 V1 页面和后续业务页面的样板页。页面需要覆盖 KPI、快捷导航、价格趋势、待办任务、动态通知、天气/用户信息和业务数据概览。

本阶段只实现前端静态页面与 mock 数据，不接真实后端业务接口，不改数据库。

## 2. 需求来源

- `docs/山东电力交易辅助决策系统-功能清单.md`
- `docs/山东电力交易辅助决策系统-PRD文档.md`
- `docs/山东电力交易辅助决策系统-菜单规划.md`
- `docs/pages/pages_design_V1.md`
- `docs/standards/frontend-development-guidelines.md`

工作台相关功能：

- 关键指标卡片：展示电量、均价、收益、偏差率等 KPI。
- 快捷导航：高频功能快速入口，支持后续扩展为自定义。
- 首页图表：展示整体趋势概览。
- 首页任务：展示待办交易、待审结算等任务提醒。
- 首页 BDC：展示关键业务数据卡片。
- 动态通知：展示系统公告、市场动态和风险提示。
- 工作台头部：展示天气、用户、交易日和市场状态。

## 3. 开发范围

### 包含

- 新增工作台首页真实页面，替换 `/dashboard` 占位页。
- 新增工作台页面组件。
- 新增工作台 TypeScript 类型。
- 新增工作台 mock 数据。
- 新增工作台页面测试。
- 接入现有前端路由生成机制。

### 不包含

- 不接真实后端接口。
- 不实现快捷导航持久化。
- 不实现通知实时推送。
- 不实现权限过滤。
- 不实现数据库或后端工作台接口。

## 4. 文件计划

新增文件：

```text
frontend/src/views/dashboard/DashboardHome.vue
frontend/src/views/dashboard/dashboard.types.ts
frontend/src/views/dashboard/dashboard.mock.ts
frontend/src/views/dashboard/dashboard-chart.ts
frontend/src/views/dashboard/components/WorkbenchHeader.vue
frontend/src/views/dashboard/components/KpiCardGrid.vue
frontend/src/views/dashboard/components/QuickNavPanel.vue
frontend/src/views/dashboard/components/TrendChartPanel.vue
frontend/src/views/dashboard/components/TaskPanel.vue
frontend/src/views/dashboard/components/NoticePanel.vue
frontend/src/views/dashboard/components/BusinessDataPanel.vue
frontend/tests/dashboard-home.spec.ts
```

修改文件：

```text
frontend/src/styles/base.css
frontend/src/router/menu-items.ts
frontend/src/router/build-routes.ts
```

## 4.1 视觉落地要求

工作台首页必须遵循 `docs/pages/dashboard/home/prototype-design.md` 和 `docs/pages/pages_design_V1.md`。实现时优先在 `frontend/src/styles/base.css` 增加全局 CSS 变量：

```css
:root {
  --theme-bg: #0A1128;
  --theme-card-bg: rgba(17, 28, 68, 0.75);
  --theme-panel-bg: #111C44;
  --color-primary: #00F2FE;
  --color-secondary: #0072FF;
  --color-success: #00E676;
  --color-danger: #FF3860;
  --color-warning: #FFB300;
  --color-muted: #8F9BBA;
  --border-glow: rgba(0, 242, 254, 0.15);
  --shadow-glow: 0 0 8px rgba(0, 242, 254, 0.3);
  --font-number: "Roboto Mono", "DIN Alternate", monospace;
}
```

页面容器使用深色背景 `--theme-bg`；工作台卡片使用半透明深蓝背景、`1px` 微光边框、`2px - 4px` 小圆角和 `12px/16px` 微缝间距。禁止使用浅色普通后台卡片作为工作台主视觉。

## 4.2 页面布局要求

`DashboardHome.vue` 按以下结构实现：

```text
DashboardHome
├── WorkbenchHeader
├── KpiCardGrid
├── main-grid
│   ├── TrendChartPanel
│   └── TaskPanel
└── bottom-grid
    ├── QuickNavPanel
    ├── NoticePanel
    └── BusinessDataPanel
```

响应式规则：

- 桌面端：KPI 5 列；趋势图占 `2/3`，任务区占 `1/3`；底部为三列或 `3:3:2`。
- 中屏：KPI 3 + 2 换行；趋势图和任务区上下排列；底部两列。
- 移动端：全部单列；快捷导航两列按钮；趋势图高度不低于 `280px`。

## 5. 数据模型

`dashboard.types.ts` 定义以下类型：

```ts
export interface WorkbenchProfile {
  userName: string;
  roleName: string;
  tradeDate: string;
  weather: string;
  temperature: string;
  marketStatus: 'open' | 'closed' | 'settling';
}

export interface KpiItem {
  key: string;
  title: string;
  value: string;
  unit?: string;
  trend: 'up' | 'down' | 'flat';
  trendText: string;
  status: 'normal' | 'success' | 'warning' | 'danger';
}

export interface QuickNavItem {
  title: string;
  path: string;
  permission: string;
  description: string;
}

export interface TrendPoint {
  time: string;
  dayAheadPrice: number;
  realtimePrice: number;
  limitPrice?: number;
}

export interface WorkbenchTask {
  id: string;
  title: string;
  module: string;
  priority: 'high' | 'medium' | 'low';
  dueText: string;
  path: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  type: 'market' | 'system' | 'warning';
  time: string;
}

export interface BusinessDataItem {
  title: string;
  value: string;
  description: string;
  status: 'normal' | 'success' | 'warning' | 'danger';
}
```

`dashboard.mock.ts` 首版数据必须覆盖：

- 1 个 `WorkbenchProfile`。
- 5 个 `KpiItem`，对应今日交易电量、月度交易电量、综合均价、预估收益、偏差率。
- 6 个 `QuickNavItem`，对应现货交易申报、D1 曲线申报、结算审核、合同列表、价格监测、策略列表。
- 至少 8 个 `TrendPoint`，包含日前价格和实时价格。
- 至少 4 个 `WorkbenchTask`，覆盖交易、结算、合同和风险提醒。
- 至少 4 个 `NoticeItem`，覆盖市场动态、系统公告和风险提示。
- 至少 4 个 `BusinessDataItem`。

## 6. 组件职责

- `DashboardHome.vue`：页面编排、布局和数据传递。
- `WorkbenchHeader.vue`：展示用户、角色、交易日、天气和市场状态。
- `KpiCardGrid.vue`：展示 KPI 指标卡片。
- `QuickNavPanel.vue`：展示高频入口，点击后进入对应菜单路由。
- `TrendChartPanel.vue`：展示日前/实时价格趋势图，ECharts option 从 `dashboard-chart.ts` 引入。
- `TaskPanel.vue`：展示待办任务和优先级。
- `NoticePanel.vue`：展示系统公告、市场动态和风险提醒。
- `BusinessDataPanel.vue`：展示首页 BDC 业务数据卡片。

组件状态要求：

- 列表类组件必须支持空数据状态。
- 任务和通知必须能按 `priority` 或 `type` 映射到风险红、预警黄、安全绿。
- KPI 数字必须使用 `--font-number`。
- 所有卡片类组件使用统一类名，例如 `.dashboard-card`，避免每个组件重复定义不同卡片风格。

## 6.1 ECharts 配置要求

新增 `dashboard-chart.ts`，导出 `buildPriceTrendOption(points: TrendPoint[])`。要求：

- 包含日前价格和实时价格两条折线。
- 使用深色背景透明配置，坐标轴和图例适配深色模式。
- 日前价格线使用 `#00F2FE`。
- 实时价格线使用 `#FFB300`。
- 面积渐变从 `rgba(0, 242, 254, 0.2)` 过渡到透明。
- 预留 `markLine` 表达限价或风险阈值。
- `animationDuration` 设置为 `2000`，`animationEasing` 设置为 `cubicOut`。

## 7. 路由接入

在 `frontend/src/router/menu-items.ts` 中将 `/dashboard` 菜单项增加组件路径：

```ts
component: 'dashboard/DashboardHome'
```

在 `frontend/src/router/build-routes.ts` 中支持菜单项自定义组件：

- 有 `component` 时加载对应页面。
- 无 `component` 时继续使用 `PlaceholderPage.vue`。

## 8. 测试计划

新增 `frontend/tests/dashboard-home.spec.ts`，覆盖：

- `/dashboard` 对应真实工作台页面，而不是占位页。
- 页面渲染“工作台首页”。
- KPI 卡片数量为 5。
- 快捷导航至少包含“现货交易申报”“D1 曲线申报”“结算审核”。
- 待办任务列表可见。
- 动态通知列表可见。
- 趋势图容器存在，并能生成日前/实时两条序列的 ECharts option。
- `buildPriceTrendOption` 返回两条 series，并包含 `markLine`。
- P0 工作台页面仍能通过菜单路由进入。

视觉验收要求：

- 页面根节点具备深色控制台背景。
- KPI 数字元素使用数字字体类名。
- 卡片组件具备微光边框和小圆角。
- 风险类任务或通知具备 danger/warning 状态样式。

## 9. 验证命令

```bash
cd frontend
npm run test
npm run build
```

验收标准：

- 前端测试通过。
- 前端构建通过。
- `/dashboard` 展示真实工作台首页。
- 其他菜单仍可继续使用占位页。
- 页面符合 `prototype-design.md` 的深色控制台布局。
- 桌面、中屏、移动端布局不出现内容重叠。

## 10. 后续扩展

- 接入 `GET /api/v1/dashboard/overview`。
- 接入真实待办任务接口。
- 接入系统通知和市场动态接口。
- 接入 WebSocket/SSE 实时行情和预警。
- 支持用户自定义快捷导航。
