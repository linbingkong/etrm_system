# 市场监测模块开发方案

## 1. 模块定位

市场监测模块用于实时/准实时监控山东电力市场价格、供需、出清、跨省联络线、气象和交易日历，为交易员提供“看行情、识别风险、进入交易决策”的前置依据。

需求来源：

- `docs/山东电力交易辅助决策系统-PRD文档.md`
- `docs/山东电力交易辅助决策系统-功能清单.md`
- `docs/山东电力交易辅助决策系统-菜单规划.md`
- `docs/pages/pages_design_V1.md`

## 2. 菜单与范围

| 页面 | 路由 | 优先级 | V1 范围 |
|---|---|---|---|
| 市场行情总览 | `/market-monitoring/overview` | P0 | 本阶段优先开发 |
| 价格监测 | `/market-monitoring/prices` | P0 | 本阶段优先开发 |
| 供需分析 | `/market-monitoring/supply-demand` | P1 | 第二阶段 |
| 跨省联络线 | `/market-monitoring/tie-line` | P1 | 第二阶段 |
| 气象监测 | `/market-monitoring/weather` | P1 | 第二阶段 |
| 交易日历 | `/market-monitoring/trading-calendar` | P1 | 第二阶段 |
| 市场参数 | `/market-monitoring/market-params` | P2 | 管理配置入口，默认隐藏 |

## 3. V1 开发目标

V1 先完成市场监测的核心读数能力：

- 市场行情总览：聚合价格、负荷、供需、风险、交易节点。
- 价格监测：承载日前出清价格、实时出清价格、现货价格走势、竞价价格分析、价差分析、价格排名。
- 提供统一筛选条件：交易日、市场类型、时段粒度、区域/主体。
- 使用 mock 数据完成前端页面，预留后端接口结构。
- 与现有菜单和路由生成机制一致，未实现页面继续使用占位页。

## 4. 页面拆分

### 4.1 市场行情总览

核心区域：

- 顶部筛选栏：交易日、市场类型、刷新时间、自动刷新开关。
- KPI 指标卡：日前均价、实时均价、最大价差、系统负荷、供需裕度、风险告警数。
- 核心趋势图：日前/实时价格、负荷预测、实际负荷组合展示。
- 供需概览：供给、需求、备用、净负荷。
- 风险观察：价格越限、价差异常、供需偏紧、联络线满载。
- 快捷入口：价格监测、现货交易申报、D1 曲线申报、交易日历。

### 4.2 价格监测

采用页面内 Tab：

- 日前出清价格
- 实时出清价格
- 现货价格走势
- 竞价价格分析
- 价差分析
- 市场价格排名

每个 Tab 首版以图表 + 关键表格为主，不做复杂编辑操作。

## 5. 前端实现计划

新增文件建议：

```text
frontend/src/views/market-monitoring/MarketOverview.vue
frontend/src/views/market-monitoring/MarketPrices.vue
frontend/src/views/market-monitoring/market-monitoring.types.ts
frontend/src/views/market-monitoring/market-monitoring.mock.ts
frontend/src/views/market-monitoring/market-monitoring-chart.ts
frontend/src/views/market-monitoring/components/MarketFilterBar.vue
frontend/src/views/market-monitoring/components/MarketKpiGrid.vue
frontend/src/views/market-monitoring/components/MarketTrendPanel.vue
frontend/src/views/market-monitoring/components/SupplyDemandPanel.vue
frontend/src/views/market-monitoring/components/RiskWatchPanel.vue
frontend/src/views/market-monitoring/components/PriceMonitorTabs.vue
frontend/src/views/market-monitoring/components/PriceRankingTable.vue
frontend/tests/market-monitoring-overview.spec.ts
frontend/tests/market-monitoring-prices.spec.ts
```

修改文件：

```text
frontend/src/router/menu-items.ts
frontend/src/router/build-routes.ts
```

## 6. 数据模型建议

```ts
export interface MarketFilter {
  tradeDate: string;
  marketType: 'dayAhead' | 'realtime' | 'spot';
  interval: '15m' | '1h';
  area?: string;
}

export interface MarketKpi {
  key: string;
  title: string;
  value: string;
  unit?: string;
  status: 'normal' | 'success' | 'warning' | 'danger';
  compareText: string;
}

export interface MarketPricePoint {
  time: string;
  dayAheadPrice: number;
  realtimePrice: number;
  spotPrice?: number;
  loadForecast?: number;
  actualLoad?: number;
}

export interface MarketRiskEvent {
  id: string;
  title: string;
  level: 'high' | 'medium' | 'low';
  source: string;
  time: string;
  description: string;
}
```

## 7. 后端接口规划

首版前端使用 mock 数据，后续按以下接口接入：

| 接口 | 方法 | 说明 |
|---|---|---|
| `/api/v1/market-monitoring/overview` | GET | 市场行情总览数据 |
| `/api/v1/market-monitoring/prices` | GET | 价格曲线与价格表格 |
| `/api/v1/market-monitoring/supply-demand` | GET | 供需分析 |
| `/api/v1/market-monitoring/risks` | GET | 市场风险事件 |
| `/api/v1/market-monitoring/trading-calendar` | GET | 交易日历与节点 |

接口参数统一使用 `tradeDate`、`marketType`、`interval`、`area`。

## 8. 视觉与交互要求

- 遵循深色控制台风格，背景使用 `#0A1128`。
- 卡片使用半透明深蓝背景、微光边框、小圆角。
- 价格上涨/风险使用 `#FF3860`，安全回落使用 `#00E676`，预测和提醒使用 `#FFB300`。
- 图表使用 ECharts，支持 96 点和后续 288 点扩展。
- 价格曲线必须包含限价或风险阈值 `markLine`。
- 表格适配深色主题，支持高亮异常行。

## 9. 测试计划

- `/market-monitoring/overview` 渲染真实页面。
- `/market-monitoring/prices` 渲染真实页面。
- 总览页至少展示 6 个 KPI。
- 总览页展示价格/负荷趋势图、风险观察、供需概览。
- 价格监测页展示 6 个 Tab。
- 图表 option 包含日前、实时价格序列和风险标记线。
- `npm run test` 与 `npm run build` 通过。

## 10. 阶段验收

V1 验收标准：

- 市场行情总览和价格监测不再显示占位页。
- 页面符合菜单规划中的 P0 范围。
- 页面视觉与工作台首页保持一致。
- mock 数据结构可平滑替换为后端接口。
- 其他 P1/P2 页面仍保留菜单与占位能力。

