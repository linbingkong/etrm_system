import type {
  D1CurvePoint,
  LongTermTradeContract,
  SpotBidPoint,
  StorageStrategyDraft,
  StorageStrategyRequest,
  StorageStrategyResponse,
  TradingKpi,
  TradingConstraintRule,
  TradingPointMode,
  TradingProgressStep,
  TradingRisk,
  TradingSession,
  TradingTodo,
  TradingWorkItem,
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

export const longTermContracts: LongTermTradeContract[] = [
  { id: 'lt-202606-001', variety: '年度双边协商', counterparty: '鲁中售电公司', period: '2026-06 至 2026-12', volumeMwh: 128000, price: 372.6, progress: 64, status: 'executing' },
  { id: 'lt-202606-002', variety: '月度集中竞价', counterparty: '华北发电集团', period: '2026-06', volumeMwh: 46200, price: 386.4, progress: 82, status: 'pending-confirm' },
  { id: 'lt-202606-003', variety: '绿电交易', counterparty: '山东新能源联合体', period: '2026-07', volumeMwh: 31800, price: 402.1, progress: 35, status: 'executing' },
  { id: 'lt-202606-004', variety: '挂牌交易', counterparty: '鲁南工业园区', period: '2026-06', volumeMwh: 18600, price: 365.8, progress: 100, status: 'completed' },
  { id: 'lt-202606-005', variety: '月内滚动交易', counterparty: '济南负荷聚合商', period: '2026-06 下旬', volumeMwh: 9400, price: 394.2, progress: 42, status: 'warning' },
];

export const tradingWorkItems: TradingWorkItem[] = [
  { id: 'work-1', title: '补全现货 96 点报量报价', module: '现货交易申报', priority: 'high', deadline: '今日 15:58', owner: '交易员A', status: 'todo', relatedNo: 'SPOT-20260615-01', path: '/trading/spot-bid' },
  { id: 'work-2', title: '提交 D1 曲线申报草稿', module: 'D1 曲线申报', priority: 'medium', deadline: '今日 16:30', owner: '交易员B', status: 'processing', relatedNo: 'D1-20260615-02', path: '/trading/d1-curve' },
  { id: 'work-3', title: '确认月度集中竞价成交结果', module: '中长期交易', priority: 'high', deadline: '今日 17:00', owner: '交易主管', status: 'todo', relatedNo: 'LT-202606-002', path: '/trading/long-term' },
  { id: 'work-4', title: '复核储能交易约束参数', module: '交易约束', priority: 'low', deadline: '今日 18:00', owner: '策略员', status: 'todo', relatedNo: 'RULE-20260615-01', path: '/trading/constraints' },
  { id: 'work-5', title: '现货申报校验通过并提交', module: '现货交易申报', priority: 'medium', deadline: '今日 14:55', owner: '交易员A', status: 'done', result: '已提交', relatedNo: 'SPOT-20260615-00', path: '/trading/spot-bid' },
  { id: 'work-6', title: 'D1 曲线退回后重提', module: 'D1 曲线申报', priority: 'high', deadline: '今日 14:20', owner: '交易员B', status: 'returned', result: '已重提', relatedNo: 'D1-20260615-01', path: '/trading/d1-curve' },
  { id: 'work-7', title: '年度双边合约确认', module: '中长期交易', priority: 'medium', deadline: '昨日 17:30', owner: '交易主管', status: 'done', result: '确认完成', relatedNo: 'LT-202606-001', path: '/trading/long-term' },
];

export const tradingConstraintRules: TradingConstraintRule[] = [
  { id: 'rule-1', category: 'unit', name: '机组最大出力约束', target: '鲁中交易单元', parameter: '最大出力', limitText: '0-4,800 MW', effectivePeriod: '2026-06-15 全天', impactModule: 'D1 曲线申报', status: 'active', owner: '调度专责' },
  { id: 'rule-2', category: 'unit', name: '爬坡速率约束', target: '鲁中交易单元', parameter: '15 分钟爬坡', limitText: '≤ 420 MW', effectivePeriod: '17:00-21:00', impactModule: 'D1 曲线申报', status: 'warning', owner: '调度专责' },
  { id: 'rule-3', category: 'storage', name: '储能充放电功率约束', target: 'storage-001', parameter: '充/放电功率', limitText: '充电 -100 MW，放电 90 MW', effectivePeriod: '2026-06-15 全天', impactModule: '现货交易申报', status: 'review', owner: '策略员' },
  { id: 'rule-4', category: 'storage', name: 'SOC 边界约束', target: 'storage-001', parameter: 'SOC', limitText: '5%-98%，期末目标 5%', effectivePeriod: '2026-06-15 全天', impactModule: '储能策略生成', status: 'active', owner: '策略员' },
  { id: 'rule-5', category: 'price', name: '现货申报价格上下限', target: '日前/实时市场', parameter: '申报电价', limitText: '-80 至 1,300 元/MWh', effectivePeriod: '2026-06-15 全天', impactModule: '现货交易申报', status: 'active', owner: '交易主管' },
  { id: 'rule-6', category: 'price', name: '价差偏离预警', target: '鲁中节点', parameter: '日前实时价差', limitText: '价差 > 100 元/MWh 预警', effectivePeriod: '滚动监测', impactModule: '价格监测', status: 'warning', owner: '风控专责' },
  { id: 'rule-7', category: 'declaration', name: '申报完整性约束', target: '现货 96 点申报', parameter: '缺失点', limitText: '不得缺失，需通过上下限校验', effectivePeriod: '申报窗口内', impactModule: '交易待办', status: 'review', owner: '交易员A' },
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
