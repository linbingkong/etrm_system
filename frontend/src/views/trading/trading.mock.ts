import type {
  D1CurvePoint,
  SpotBidPoint,
  StorageStrategyDraft,
  StorageStrategyRequest,
  StorageStrategyResponse,
  TradingKpi,
  TradingPointMode,
  TradingProgressStep,
  TradingRisk,
  TradingSession,
  TradingTodo,
  ValidationItem,
} from './trading.types';

export const tradingSession: TradingSession = {
  tradeDate: '2026-06-15',
  marketType: 'dayAhead',
  roundName: '日前申报第 1 轮',
  windowStatus: 'closing',
  updatedAt: '15:30',
  pointMode: '24',
};

export const tradingKpis: TradingKpi[] = [
  { key: 'todo', title: '待申报事项', value: '3', unit: '项', status: 'warning', description: '含 1 项高优先级' },
  { key: 'submitted', title: '已提交曲线', value: '2', unit: '条', status: 'success', description: '日前与 D1 已暂存' },
  { key: 'volume', title: '成交电量', value: '18,420', unit: 'MWh', status: 'normal', description: '较昨日 +4.8%' },
  { key: 'avg-price', title: '申报均价', value: '386.24', unit: '元/MWh', status: 'normal', description: '参考实时均价' },
  { key: 'risk', title: '偏差风险', value: '2', unit: '项', status: 'danger', description: '价格与爬坡约束' },
  { key: 'deadline', title: '窗口剩余', value: '28', unit: '分钟', status: 'warning', description: '申报窗口即将关闭' },
];

export const tradingProgressSteps: TradingProgressStep[] = [
  { key: 'market', title: '市场监测', status: 'done', description: '价格与供需已更新' },
  { key: 'spot', title: '现货申报', status: 'active', description: '待完成 96 点校验' },
  { key: 'd1', title: 'D1 曲线', status: 'pending', description: '曲线草稿待提交' },
  { key: 'settlement', title: '结算联动', status: 'pending', description: '成交后进入结算' },
];

export const tradingRisks: TradingRisk[] = [
  { id: 'risk-1', title: '05:00 申报价格接近上限', level: 'high', source: '现货申报', time: '15:12', path: '/trading/spot-bid' },
  { id: 'risk-2', title: 'D1 曲线 18:00 爬坡偏大', level: 'medium', source: 'D1 曲线', time: '15:18', path: '/trading/d1-curve' },
  { id: 'risk-3', title: '申报窗口 30 分钟内关闭', level: 'medium', source: '交易日历', time: '15:20' },
];

export const tradingTodos: TradingTodo[] = [
  { id: 'todo-1', title: '补全现货 96 点申报', module: '现货交易', priority: 'high', dueText: '28 分钟后截止', path: '/trading/spot-bid' },
  { id: 'todo-2', title: '提交 D1 曲线草稿', module: '曲线申报', priority: 'medium', dueText: '今日 16:30', path: '/trading/d1-curve' },
  { id: 'todo-3', title: '复核交易约束参数', module: '交易约束', priority: 'low', dueText: '今日 18:00', path: '/trading/constraints' },
];

const baseSpotPoints: SpotBidPoint[] = Array.from({ length: 96 }, (_, index) => {
  const hour = Math.floor(index / 4);
  const minute = (index % 4) * 15;
  const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  const forecastLoad = Math.round(56000 + Math.sin(index / 8) * 9000 + (hour >= 17 && hour <= 21 ? 6000 : 0));
  const referencePrice = Number((320 + Math.sin(index / 10) * 170 + (hour >= 18 && hour <= 22 ? 110 : 0)).toFixed(2));
  const bidPrice = Number((referencePrice + (index % 9 === 0 ? 68 : index % 7 === 0 ? -36 : 12)).toFixed(2));
  const bidVolume = Math.round(forecastLoad / 12);
  const status = bidPrice > 580 ? 'rejected' : Math.abs(bidPrice - referencePrice) > 60 ? 'validating' : 'draft';

  return {
    time,
    forecastLoad,
    bidVolume,
    bidPrice,
    referencePrice,
    minPrice: -80,
    maxPrice: 650,
    status,
    remark: status === 'rejected' ? '价格接近上限，需复核' : status === 'validating' ? '价格偏离较大' : '待提交',
  };
});

export const spotBidPoints96: SpotBidPoint[] = baseSpotPoints;
export const spotBidPoints24: SpotBidPoint[] = spotBidPoints96.filter((point) => point.time.endsWith(':00'));

export function getSpotBidPoints(mode: TradingPointMode): SpotBidPoint[] {
  return mode === '96' ? spotBidPoints96 : spotBidPoints24;
}

export const d1CurvePoints: D1CurvePoint[] = spotBidPoints96.map((point, index) => {
  const planPower = Math.round(point.forecastLoad / 14);
  const declaredPower = Math.round(planPower + Math.sin(index / 6) * 420 + (index % 17 === 0 ? 520 : 0));
  const deviation = declaredPower - planPower;
  const status = Math.abs(deviation) > 700 ? 'danger' : Math.abs(deviation) > 420 ? 'warning' : 'normal';

  return {
    time: point.time,
    planPower,
    declaredPower,
    forecastLoad: point.forecastLoad,
    deviation,
    status,
  };
});

export const spotValidationItems: ValidationItem[] = [
  { key: 'missing', title: '缺失点检查', status: 'success', description: '24/96 点数据完整' },
  { key: 'limit', title: '价格上下限', status: 'warning', description: '2 个时段接近上限' },
  { key: 'spread', title: '参考价偏离', status: 'warning', description: '5 个时段偏离超过 60 元/MWh' },
  { key: 'submit', title: '提交状态', status: 'normal', description: '校验通过后可提交' },
];

export const d1ValidationItems: ValidationItem[] = [
  { key: 'complete', title: '曲线完整性', status: 'success', description: '96 点曲线完整' },
  { key: 'ramp', title: '爬坡约束', status: 'warning', description: '18:00 附近变化偏大' },
  { key: 'limit', title: '出力上下限', status: 'success', description: '未超过交易单元约束' },
  { key: 'deviation', title: '偏差阈值', status: 'warning', description: '3 个时段超过预警阈值' },
];
export const storageStrategyDrafts: StorageStrategyDraft[] = [
  { id: 'strategy-1', name: '策略1', status: 'generated', updatedAt: '14:20' },
  { id: 'strategy-2', name: '晚高峰高价策略', status: 'draft', updatedAt: '未生成' },
];

export const defaultStorageStrategyRequest: StorageStrategyRequest = {
  market_date: '2026-06-17',
  station_id: 'storage-001',
  node_id: 'sd-node-001',
  time_step_min: 15,
  p_charge_max_mw: 100,
  p_discharge_max_mw: 90,
  storage_capacity_mwh: 200,
  soc_initial: 0.05,
  soc_min: 0.05,
  soc_max: 0.98,
  soc_terminal_target: 0.05,
  eta_charge: 0.9,
  eta_discharge: 0.9,
  price_floor: -80,
  price_cap: 1300,
  charge_price_signal: spotBidPoints96.map((point) => point.referencePrice),
  discharge_price_signal: spotBidPoints96.map((point) => Number((point.referencePrice + 35).toFixed(2))),
  degradation_cost_yuan_per_mwh: 5,
  variable_fee_yuan_per_mwh: 1,
  risk_margin_yuan_per_mwh: 2,
  required_profit_spread_yuan_per_mwh: 80,
  trading_strategy: 'balanced',
  min_charge_steps: 1,
  min_discharge_steps: 1,
  min_idle_steps: 1,
  solver_time_limit_sec: 10,
  mip_gap: 0.01,
  merge_price_gap_yuan_per_mwh: 20,
};

export const defaultStorageStrategyResult: StorageStrategyResponse = {
  station_id: defaultStorageStrategyRequest.station_id,
  node_id: defaultStorageStrategyRequest.node_id,
  market_date: defaultStorageStrategyRequest.market_date,
  strategy: 'milp_optimization',
  validation_passed: true,
  validation_errors: [],
  submission_packet: {
    daily_params: {
      expected_revenue_yuan: 153000,
      expected_charge_cost_yuan: 62400,
      expected_degradation_cost_yuan: 2200,
      expected_variable_fee_yuan: 850,
      expected_risk_cost_yuan: 900,
      expected_profit_yuan: 86650,
      expected_profit_after_required_spread_yuan: 74850,
    },
  },
  charge_segments: [
    { p_start: -100, p_end: -95, price: -80 },
    { p_start: -95, p_end: 0, price: 100 },
  ],
  discharge_segments: [
    { p_start: 0, p_end: 90, price: 250 },
    { p_start: 90, p_end: 100, price: 1300 },
  ],
  derived_feasible_power_mw: spotBidPoints96.map((_point, index) => {
    if (index >= 38 && index <= 55) return -100;
    if (index >= 67 && index <= 86) return 90;
    return 0;
  }),
  derived_soc: Array.from({ length: 97 }, (_item, index) => {
    if (index < 39) return 0.05;
    if (index < 57) return Number(Math.min(0.98, 0.05 + (index - 38) * 0.045).toFixed(4));
    if (index < 88) return Number(Math.max(0.05, 0.9 - Math.max(0, index - 67) * 0.043).toFixed(4));
    return 0.05;
  }),
};
