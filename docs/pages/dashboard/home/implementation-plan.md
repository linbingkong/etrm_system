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
frontend/src/router/menu-items.ts
frontend/src/router/build-routes.ts
```

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
}

export interface TrendPoint {
  time: string;
  dayAheadPrice: number;
  realtimePrice: number;
}

export interface WorkbenchTask {
  id: string;
  title: string;
  module: string;
  priority: 'high' | 'medium' | 'low';
  dueText: string;
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
}
```

## 6. 组件职责

- `DashboardHome.vue`：页面编排、布局和数据传递。
- `WorkbenchHeader.vue`：展示用户、角色、交易日、天气和市场状态。
- `KpiCardGrid.vue`：展示 KPI 指标卡片。
- `QuickNavPanel.vue`：展示高频入口，点击后进入对应菜单路由。
- `TrendChartPanel.vue`：展示日前/实时价格趋势图，ECharts option 提取为纯函数。
- `TaskPanel.vue`：展示待办任务和优先级。
- `NoticePanel.vue`：展示系统公告、市场动态和风险提醒。
- `BusinessDataPanel.vue`：展示首页 BDC 业务数据卡片。

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

## 10. 后续扩展

- 接入 `GET /api/v1/dashboard/overview`。
- 接入真实待办任务接口。
- 接入系统通知和市场动态接口。
- 接入 WebSocket/SSE 实时行情和预警。
- 支持用户自定义快捷导航。
