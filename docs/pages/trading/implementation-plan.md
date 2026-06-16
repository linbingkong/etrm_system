# 交易管理模块实施方案

## 1. 模块定位

交易管理模块支撑中长期交易、现货日前/实时申报、D1 曲线申报、交易待办与执行跟踪，是“市场分析 → 交易申报 → 成交跟踪 → 结算审核”链路中的核心操作域。

需求来源：

- `docs/山东电力交易辅助决策系统-PRD文档.md`
- `docs/山东电力交易辅助决策系统-功能清单.md`
- `docs/山东电力交易辅助决策系统-菜单规划.md`
- `docs/pages/pages_design_V1.md`

## 2. 菜单与范围

| 页面 | 路由 | 优先级 | V1 范围 |
|---|---|---|---|
| 交易总览 | `/trading/overview` | P0 | 本阶段优先开发 |
| 中长期交易 | `/trading/long-term` | P0 | 第二阶段 |
| 现货交易申报 | `/trading/spot-bid` | P0 | 本阶段优先开发 |
| D1 曲线申报 | `/trading/d1-curve` | P0 | 本阶段优先开发 |
| 交易待办 | `/trading/todo` | P0 | 可合并到交易总览首版 |
| 交易已办 | `/trading/done` | P1 | 第二阶段 |
| 滚动撮合 | `/trading/rolling-matching` | P1 | 第二阶段 |
| 交易约束 | `/trading/constraints` | P1 | 第二阶段 |
| 限价管理 | `/trading/price-limits` | P2 | 配置入口，默认隐藏 |

## 3. V1 开发目标

V1 聚焦交易员日常最高频场景：

- 交易总览：汇总交易日、轮次、申报进度、风险、待办和成交概览。
- 现货交易申报：支持 24/96 点量价申报数据展示、编辑状态、校验和提交入口。
- D1 曲线申报：支持 96 点发电曲线展示、计划/申报/偏差对比和保存/提交入口。
- 首版使用 mock 数据，不接真实后端接口；预留接口参数与状态模型。
- 与市场监测模块联动：可从价格异常、供需偏紧进入现货申报。

## 4. 页面拆分

### 4.1 交易总览

核心区域：

- 顶部状态栏：交易日、市场类型、交易轮次、申报窗口状态、更新时间。
- KPI 指标：待申报事项、已提交曲线、成交电量、申报均价、偏差风险、待办数量。
- 交易进度：日前申报、实时调整、D1 曲线、结算联动四段流程。
- 风险提醒：限价触达、缺失时段、供需偏紧、申报截止。
- 待办列表：现货申报、D1 曲线、交易约束复核。
- 快捷入口：现货交易申报、D1 曲线申报、价格监测、交易日历。

### 4.2 现货交易申报

核心区域：

- 筛选栏：交易日、市场类型、申报轮次、点数模式 24/96、主体/机组。
- 价格参考：日前价格、实时价格、限价线、价差提示。
- 量价申报表：时段、预测负荷、申报电量、申报价格、参考价格、状态、备注。
- 曲线图：申报电量、参考价格、限价线组合图。
- 校验面板：缺失点、越限点、价格偏离、总电量偏差。
- 操作按钮：暂存、校验、提交、撤回、导出。

### 4.3 D1 曲线申报

核心区域：

- 筛选栏：交易日、曲线类型、机组/交易单元、点数模式。
- 曲线图：计划曲线、申报曲线、实际/预测负荷、偏差区间。
- 明细表：时段、计划电量、申报电量、偏差、状态、备注。
- 校验面板：爬坡约束、上下限、缺失点、偏差阈值。
- 操作按钮：保存草稿、校验、提交。

## 5. 前端实现计划

新增文件建议：

```text
frontend/src/views/trading/TradingOverview.vue
frontend/src/views/trading/SpotBid.vue
frontend/src/views/trading/D1Curve.vue
frontend/src/views/trading/trading.types.ts
frontend/src/views/trading/trading.mock.ts
frontend/src/views/trading/trading-chart.ts
frontend/src/views/trading/components/TradingFilterBar.vue
frontend/src/views/trading/components/TradingKpiGrid.vue
frontend/src/views/trading/components/TradingProgressPanel.vue
frontend/src/views/trading/components/TradingRiskPanel.vue
frontend/src/views/trading/components/TradingTodoPanel.vue
frontend/src/views/trading/components/SpotBidTable.vue
frontend/src/views/trading/components/SpotBidChart.vue
frontend/src/views/trading/components/D1CurveChart.vue
frontend/src/views/trading/components/D1CurveTable.vue
frontend/src/views/trading/components/ValidationPanel.vue
frontend/tests/trading-overview.spec.ts
frontend/tests/trading-spot-bid.spec.ts
frontend/tests/trading-d1-curve.spec.ts
```

修改文件：

```text
frontend/src/router/build-routes.ts
tdlist.md
```

## 6. 数据模型建议

```ts
export type TradingPointMode = '24' | '96';
export type TradingMarketType = 'dayAhead' | 'realtime';
export type SubmitStatus = 'draft' | 'validating' | 'ready' | 'submitted' | 'rejected';

export interface TradingSession {
  tradeDate: string;
  marketType: TradingMarketType;
  roundName: string;
  windowStatus: 'open' | 'closing' | 'closed';
  updatedAt: string;
}

export interface SpotBidPoint {
  time: string;
  forecastLoad: number;
  bidVolume: number;
  bidPrice: number;
  referencePrice: number;
  minPrice: number;
  maxPrice: number;
  status: SubmitStatus;
  remark: string;
}

export interface D1CurvePoint {
  time: string;
  planPower: number;
  declaredPower: number;
  forecastLoad: number;
  deviation: number;
  status: 'normal' | 'warning' | 'danger';
}
```

## 7. 后端接口规划

首版前端使用 mock 数据，后续预留接口：

| 接口 | 方法 | 说明 |
|---|---|---|
| `/api/v1/trading/overview` | GET | 交易总览数据 |
| `/api/v1/trading/spot-bid` | GET | 现货申报点表与参考价格 |
| `/api/v1/trading/spot-bid/save` | POST | 暂存申报 |
| `/api/v1/trading/spot-bid/validate` | POST | 申报校验 |
| `/api/v1/trading/spot-bid/submit` | POST | 提交申报 |
| `/api/v1/trading/d1-curve` | GET | D1 曲线数据 |
| `/api/v1/trading/d1-curve/save` | POST | 保存 D1 曲线 |
| `/api/v1/trading/d1-curve/submit` | POST | 提交 D1 曲线 |

接口参数统一包括 `tradeDate`、`marketType`、`roundId`、`pointMode`、`unitId`。

## 8. 权限与状态

按钮权限：

- `trading:spot-bid:submit`
- `trading:spot-bid:cancel`
- `trading:spot-bid:export`
- `trading:d1-curve:save`
- `trading:d1-curve:submit`

状态要求：

- 加载中：局部骨架屏或 loading。
- 空数据：提示当前交易日暂无申报数据。
- 校验失败：展示失败项并定位到对应时段。
- 无权限：隐藏或禁用提交/撤回/导出按钮。
- 已闭市：申报表只读，提交按钮禁用。

## 9. 测试计划

- `/trading/overview` 渲染真实交易总览页。
- `/trading/spot-bid` 渲染真实现货交易申报页。
- `/trading/d1-curve` 渲染真实 D1 曲线申报页。
- 交易总览展示 KPI、进度、待办和风险。
- 现货申报支持 24/96 点数据切换。
- 现货申报图表包含申报电量、参考价格、限价线。
- D1 曲线图表包含计划曲线、申报曲线和偏差。
- 操作按钮具备禁用/无权限状态。
- `npm run test` 与 `npm run build` 通过。

## 10. 阶段验收

V1 验收标准：

- 交易总览、现货交易申报、D1 曲线申报不再显示占位页。
- 页面符合深色交易控制台风格。
- 表格支持 24/96 点展示，移动端不重叠。
- mock 数据结构可替换为后端接口。
- 交易操作暂不真实提交，但具备完整按钮状态、校验提示和数据流占位。
## 11. 现货交易申报重设计实施补充

### 11.1 后端联调范围

- 新增 `POST /api/v1/trading/spot-bid/storage-strategy`。
- 请求参数覆盖储能功率、容量、SOC、效率、价格边界、成本、风险边际、收益价差、最小连续时长和 96 点价格信号。
- 后端基于 `pulp` MILP 求解生成 `charge_segments`、`discharge_segments`、`derived_feasible_power_mw`、`derived_soc` 和收益分解。

### 11.2 前端实现范围

- `SpotBid.vue` 改造为独立储能策略工作台。
- 页面包含预测价格曲线、策略列表、三步步骤条、参数表单、策略曲线、分段报价表和收益测算。
- 使用 `frontend/src/api/trading.ts` 调用后端策略接口；接口失败时保留当前参数并展示错误信息。

### 11.3 测试与验证

- 后端补充储能策略接口测试，覆盖成功生成和 96 点数组校验。
- 前端补充现货交易申报页测试，覆盖页面结构、24/96 点、API 调用和路由绑定。
- 验证命令：`pytest backend/tests/test_storage_strategy.py`、`cd frontend && npm run test -- trading-spot-bid.spec.ts`、完整测试和构建。

