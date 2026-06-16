import type {
  BusinessDataItem,
  KpiItem,
  NoticeItem,
  QuickNavItem,
  TrendPoint,
  WorkbenchProfile,
  WorkbenchTask,
} from './dashboard.types';

export const dashboardProfile: WorkbenchProfile = {
  userName: '王交易员',
  roleName: '交易决策人员',
  tradeDate: '2026-06-14',
  weather: '济南 晴',
  temperature: '31℃',
  marketStatus: 'open',
};

export const dashboardKpis: KpiItem[] = [
  { key: 'todayEnergy', title: '今日交易电量', value: '12,860', unit: 'MWh', trend: 'up', trendText: '较昨日 +6.8%', status: 'success' },
  { key: 'monthEnergy', title: '月度交易电量', value: '286,400', unit: 'MWh', trend: 'up', trendText: '完成率 72%', status: 'normal' },
  { key: 'avgPrice', title: '综合均价', value: '392.6', unit: '元/MWh', trend: 'down', trendText: '较日前 -3.2', status: 'success' },
  { key: 'estimatedProfit', title: '预估收益', value: '468.2', unit: '万元', trend: 'up', trendText: '较计划 +4.1%', status: 'normal' },
  { key: 'deviationRate', title: '偏差率', value: '2.7', unit: '%', trend: 'flat', trendText: '安全区间', status: 'warning' },
];

export const dashboardQuickNavs: QuickNavItem[] = [
  { title: '现货交易申报', path: '/trading/spot-bid', permission: 'trading:spot-bid', description: '日前/实时量价申报' },
  { title: 'D1 曲线申报', path: '/trading/d1-curve', permission: 'trading:d1-curve', description: '曲线填报与校验' },
  { title: '结算审核', path: '/settlement/review', permission: 'settlement:review', description: '待审结算单处理' },
  { title: '合同列表', path: '/contracts/list', permission: 'contracts:list', description: '中长期合同查询' },
  { title: '价格监测', path: '/market-monitoring/prices', permission: 'market-monitoring:prices', description: '日前/实时价格趋势' },
  { title: '策略列表', path: '/strategy/list', permission: 'strategy:list', description: '交易策略维护' },
];

export const dashboardTrendPoints: TrendPoint[] = [
  { time: '00:00', dayAheadPrice: 368, realtimePrice: 376, limitPrice: 520 },
  { time: '03:00', dayAheadPrice: 352, realtimePrice: 358, limitPrice: 520 },
  { time: '06:00', dayAheadPrice: 371, realtimePrice: 366, limitPrice: 520 },
  { time: '09:00', dayAheadPrice: 402, realtimePrice: 418, limitPrice: 520 },
  { time: '12:00', dayAheadPrice: 436, realtimePrice: 451, limitPrice: 520 },
  { time: '15:00', dayAheadPrice: 421, realtimePrice: 409, limitPrice: 520 },
  { time: '18:00', dayAheadPrice: 468, realtimePrice: 493, limitPrice: 520 },
  { time: '21:00', dayAheadPrice: 399, realtimePrice: 386, limitPrice: 520 },
];

export const dashboardTasks: WorkbenchTask[] = [
  { id: 'task-1', title: '实时市场 18:00-20:00 申报待确认', module: '交易管理', priority: 'high', dueText: '25 分钟后截止', path: '/trading/spot-bid' },
  { id: 'task-2', title: '6 月第 2 批结算单待审核', module: '结算管理', priority: 'high', dueText: '今日 17:30 前', path: '/settlement/review' },
  { id: 'task-3', title: '华能长协合同即将到期', module: '合同管理', priority: 'medium', dueText: '3 天后到期', path: '/contracts/list' },
  { id: 'task-4', title: '偏差率接近预警阈值', module: '考核管理', priority: 'medium', dueText: '持续监控', path: '/assessment/two-assessment-analysis' },
];

export const dashboardNotices: NoticeItem[] = [
  { id: 'notice-1', title: '山东现货实时价格 18:00 时段明显上行', type: 'market', time: '10 分钟前' },
  { id: 'notice-2', title: '系统将于今晚 23:30 进行例行维护', type: 'system', time: '30 分钟前' },
  { id: 'notice-3', title: '机组出力约束变更，请复核 D1 曲线', type: 'warning', time: '42 分钟前' },
  { id: 'notice-4', title: '新能源预测出力较日前计划下调 3.6%', type: 'market', time: '1 小时前' },
];

export const dashboardBusinessData: BusinessDataItem[] = [
  { title: '已申报交易数', value: '18', description: '今日完成申报', status: 'success' },
  { title: '待审核结算单', value: '7', description: '包含 2 条高优先级', status: 'warning' },
  { title: '合同即将到期', value: '4', description: '未来 7 天', status: 'warning' },
  { title: '实时告警数量', value: '2', description: '偏差与限价预警', status: 'danger' },
];
