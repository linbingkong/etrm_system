import type {
  MarketFilter,
  MarketKpi,
  MarketPointMode,
  MarketPricePoint,
  MarketQuickLink,
  MarketRiskEvent,
  PriceMonitorTab,
  PriceRankingItem,
  PriceForecastFilter,
  PriceForecastPoint,
  PriceForecastRisk,
  PriceSummaryItem,
  PriceDetailRow,
  SupplyDemandItem,
  SupplyDemandSlot,
  TieLineFlow,
  TradingCalendarEvent,
  WeatherSlot,
} from './market-monitoring.types';

export const marketFilter: MarketFilter = {
  tradeDate: '2026-06-14',
  marketType: 'spot',
  interval: '1h',
  area: '山东全网',
  updatedAt: '13:15',
  autoRefresh: false,
};

export const marketKpis: MarketKpi[] = [
  { key: 'da-average', title: '日前均价', value: '356.72', unit: '元/MWh', status: 'normal', compareText: '较昨日 +3.4%' },
  { key: 'rt-average', title: '实时均价', value: '389.18', unit: '元/MWh', status: 'warning', compareText: '高于日前 32.46' },
  { key: 'max-spread', title: '最大价差', value: '96.40', unit: '元/MWh', status: 'danger', compareText: '09:00 时段异常' },
  { key: 'system-load', title: '系统负荷', value: '74,280', unit: 'MW', status: 'normal', compareText: '高峰预计 19:00' },
  { key: 'supply-margin', title: '供需裕度', value: '8.6', unit: '%', status: 'warning', compareText: '低于安全阈值' },
  { key: 'risk-count', title: '风险告警', value: '4', unit: '项', status: 'danger', compareText: '2 项高风险' },
];

export const marketPricePoints96: MarketPricePoint[] = [
  { time: '00:00', dayAheadPrice: 346.64, realtimePrice: 476.24, spotPrice: 411.44, loadForecast: 62131, actualLoad: 63215 },
  { time: '00:15', dayAheadPrice: 362.50, realtimePrice: 386.00, spotPrice: 374.25, loadForecast: 61531, actualLoad: 62318 },
  { time: '00:30', dayAheadPrice: 386.86, realtimePrice: 386.00, spotPrice: 386.43, loadForecast: 61001, actualLoad: 61600 },
  { time: '00:45', dayAheadPrice: 366.00, realtimePrice: 386.00, spotPrice: 376.00, loadForecast: 60303, actualLoad: 61480 },
  { time: '01:00', dayAheadPrice: 374.00, realtimePrice: 386.00, spotPrice: 380.00, loadForecast: 60206, actualLoad: 60822 },
  { time: '01:15', dayAheadPrice: 364.00, realtimePrice: 386.00, spotPrice: 375.00, loadForecast: 59283, actualLoad: 60643 },
  { time: '01:30', dayAheadPrice: 363.32, realtimePrice: 386.00, spotPrice: 374.66, loadForecast: 59301, actualLoad: 60284 },
  { time: '01:45', dayAheadPrice: 325.00, realtimePrice: 386.00, spotPrice: 355.50, loadForecast: 58845, actualLoad: 59865 },
  { time: '02:00', dayAheadPrice: 354.80, realtimePrice: 386.00, spotPrice: 370.40, loadForecast: 58714, actualLoad: 59446 },
  { time: '02:15', dayAheadPrice: 363.80, realtimePrice: 386.00, spotPrice: 374.90, loadForecast: 58210, actualLoad: 58968 },
  { time: '02:30', dayAheadPrice: 358.00, realtimePrice: 396.60, spotPrice: 377.30, loadForecast: 58151, actualLoad: 59028 },
  { time: '02:45', dayAheadPrice: 345.00, realtimePrice: 399.76, spotPrice: 372.38, loadForecast: 57692, actualLoad: 58549 },
  { time: '03:00', dayAheadPrice: 308.11, realtimePrice: 418.90, spotPrice: 363.50, loadForecast: 57472, actualLoad: 58549 },
  { time: '03:15', dayAheadPrice: 327.24, realtimePrice: 424.00, spotPrice: 375.62, loadForecast: 57204, actualLoad: 58130 },
  { time: '03:30', dayAheadPrice: 324.67, realtimePrice: 462.22, spotPrice: 393.45, loadForecast: 57070, actualLoad: 58250 },
  { time: '03:45', dayAheadPrice: 328.77, realtimePrice: 489.92, spotPrice: 409.35, loadForecast: 56946, actualLoad: 58297 },
  { time: '04:00', dayAheadPrice: 338.81, realtimePrice: 512.50, spotPrice: 425.65, loadForecast: 57488, actualLoad: 58295 },
  { time: '04:15', dayAheadPrice: 351.25, realtimePrice: 539.84, spotPrice: 445.55, loadForecast: 57611, actualLoad: 58653 },
  { time: '04:30', dayAheadPrice: 359.89, realtimePrice: 567.56, spotPrice: 463.72, loadForecast: 58157, actualLoad: 59061 },
  { time: '04:45', dayAheadPrice: 386.00, realtimePrice: 598.94, spotPrice: 492.47, loadForecast: 58685, actualLoad: 59625 },
  { time: '05:00', dayAheadPrice: 377.50, realtimePrice: 598.94, spotPrice: 488.22, loadForecast: 59165, actualLoad: 60159 },
  { time: '05:15', dayAheadPrice: 376.00, realtimePrice: 598.04, spotPrice: 487.02, loadForecast: 58858, actualLoad: 60498 },
  { time: '05:30', dayAheadPrice: 362.00, realtimePrice: 566.00, spotPrice: 464.00, loadForecast: 59115, actualLoad: 60788 },
  { time: '05:45', dayAheadPrice: 334.52, realtimePrice: 517.92, spotPrice: 426.22, loadForecast: 59412, actualLoad: 60638 },
  { time: '06:00', dayAheadPrice: 290.00, realtimePrice: 470.00, spotPrice: 380.00, loadForecast: 59476, actualLoad: 60588 },
  { time: '06:15', dayAheadPrice: 0.00, realtimePrice: 412.96, spotPrice: 206.48, loadForecast: 59190, actualLoad: 59897 },
  { time: '06:30', dayAheadPrice: -80.00, realtimePrice: 78.24, spotPrice: -0.88, loadForecast: 58647, actualLoad: 58754 },
  { time: '06:45', dayAheadPrice: -80.00, realtimePrice: -80.00, spotPrice: -80.00, loadForecast: 58360, actualLoad: 57689 },
  { time: '07:00', dayAheadPrice: -80.00, realtimePrice: -80.00, spotPrice: -80.00, loadForecast: 60504, actualLoad: 57312 },
  { time: '07:15', dayAheadPrice: -80.00, realtimePrice: -80.00, spotPrice: -80.00, loadForecast: 60564, actualLoad: 57299 },
  { time: '07:30', dayAheadPrice: 24.52, realtimePrice: -80.00, spotPrice: -27.74, loadForecast: 60867, actualLoad: 56933 },
  { time: '07:45', dayAheadPrice: -80.00, realtimePrice: -80.00, spotPrice: -80.00, loadForecast: 60858, actualLoad: 56669 },
  { time: '08:00', dayAheadPrice: 158.08, realtimePrice: -80.00, spotPrice: 39.04, loadForecast: 61457, actualLoad: 56472 },
  { time: '08:15', dayAheadPrice: 159.60, realtimePrice: -80.00, spotPrice: 39.80, loadForecast: 61008, actualLoad: 55896 },
  { time: '08:30', dayAheadPrice: 341.96, realtimePrice: -80.00, spotPrice: 130.98, loadForecast: 60341, actualLoad: 55328 },
  { time: '08:45', dayAheadPrice: -39.61, realtimePrice: -80.00, spotPrice: -59.80, loadForecast: 59277, actualLoad: 53921 },
  { time: '09:00', dayAheadPrice: -68.39, realtimePrice: -80.00, spotPrice: -74.19, loadForecast: 58575, actualLoad: 53353 },
  { time: '09:15', dayAheadPrice: -80.00, realtimePrice: -80.00, spotPrice: -80.00, loadForecast: 57466, actualLoad: 52459 },
  { time: '09:30', dayAheadPrice: -80.00, realtimePrice: -80.00, spotPrice: -80.00, loadForecast: 56986, actualLoad: 51540 },
  { time: '09:45', dayAheadPrice: -67.72, realtimePrice: -80.00, spotPrice: -73.86, loadForecast: 56016, actualLoad: 51577 },
  { time: '10:00', dayAheadPrice: -44.09, realtimePrice: -80.00, spotPrice: -62.05, loadForecast: 56052, actualLoad: 52648 },
  { time: '10:15', dayAheadPrice: -80.00, realtimePrice: -80.00, spotPrice: -80.00, loadForecast: 56091, actualLoad: 53045 },
  { time: '10:30', dayAheadPrice: -80.00, realtimePrice: -80.00, spotPrice: -80.00, loadForecast: 55680, actualLoad: 52862 },
  { time: '10:45', dayAheadPrice: -80.00, realtimePrice: -80.00, spotPrice: -80.00, loadForecast: 55221, actualLoad: 53308 },
  { time: '11:00', dayAheadPrice: -80.00, realtimePrice: -80.00, spotPrice: -80.00, loadForecast: 55639, actualLoad: 54163 },
  { time: '11:15', dayAheadPrice: -80.00, realtimePrice: -80.00, spotPrice: -80.00, loadForecast: 53841, actualLoad: 52739 },
  { time: '11:30', dayAheadPrice: -80.00, realtimePrice: -80.00, spotPrice: -80.00, loadForecast: 51890, actualLoad: 51497 },
  { time: '11:45', dayAheadPrice: -80.00, realtimePrice: -80.00, spotPrice: -80.00, loadForecast: 49284, actualLoad: 49619 },
  { time: '12:00', dayAheadPrice: 2.09, realtimePrice: -80.00, spotPrice: -38.95, loadForecast: 47769, actualLoad: 48338 },
  { time: '12:15', dayAheadPrice: -57.99, realtimePrice: -80.00, spotPrice: -69.00, loadForecast: 47585, actualLoad: 47908 },
  { time: '12:30', dayAheadPrice: -80.00, realtimePrice: -80.00, spotPrice: -80.00, loadForecast: 47631, actualLoad: 48272 },
  { time: '12:45', dayAheadPrice: -59.76, realtimePrice: -80.00, spotPrice: -69.88, loadForecast: 47687, actualLoad: 48015 },
  { time: '13:00', dayAheadPrice: -61.48, realtimePrice: -80.00, spotPrice: -70.74, loadForecast: 48458, actualLoad: 48857 },
  { time: '13:15', dayAheadPrice: -60.62, realtimePrice: -80.00, spotPrice: -70.31, loadForecast: 48964, actualLoad: 49587 },
  { time: '13:30', dayAheadPrice: -80.00, realtimePrice: -80.00, spotPrice: -80.00, loadForecast: 50041, actualLoad: 50276 },
  { time: '13:45', dayAheadPrice: -80.00, realtimePrice: -80.00, spotPrice: -80.00, loadForecast: 50166, actualLoad: 50757 },
  { time: '14:00', dayAheadPrice: -80.00, realtimePrice: -80.00, spotPrice: -80.00, loadForecast: 51387, actualLoad: 51135 },
  { time: '14:15', dayAheadPrice: -80.00, realtimePrice: -80.00, spotPrice: -80.00, loadForecast: 52226, actualLoad: 51910 },
  { time: '14:30', dayAheadPrice: -80.00, realtimePrice: -80.00, spotPrice: -80.00, loadForecast: 53782, actualLoad: 52816 },
  { time: '14:45', dayAheadPrice: -80.00, realtimePrice: -80.00, spotPrice: -80.00, loadForecast: 54865, actualLoad: 53567 },
  { time: '15:00', dayAheadPrice: -80.00, realtimePrice: -80.00, spotPrice: -80.00, loadForecast: 56377, actualLoad: 54758 },
  { time: '15:15', dayAheadPrice: -80.00, realtimePrice: -80.00, spotPrice: -80.00, loadForecast: 58025, actualLoad: 55664 },
  { time: '15:30', dayAheadPrice: -80.00, realtimePrice: -80.00, spotPrice: -80.00, loadForecast: 59348, actualLoad: 57157 },
  { time: '15:45', dayAheadPrice: -80.00, realtimePrice: -80.00, spotPrice: -80.00, loadForecast: 60023, actualLoad: 58884 },
  { time: '16:00', dayAheadPrice: -80.00, realtimePrice: -80.00, spotPrice: -80.00, loadForecast: 61418, actualLoad: 60220 },
  { time: '16:15', dayAheadPrice: -42.50, realtimePrice: 222.60, spotPrice: 90.05, loadForecast: 63505, actualLoad: 62017 },
  { time: '16:30', dayAheadPrice: 365.71, realtimePrice: 431.40, spotPrice: 398.55, loadForecast: 65327, actualLoad: 63871 },
  { time: '16:45', dayAheadPrice: 517.52, realtimePrice: 428.00, spotPrice: 472.76, loadForecast: 66636, actualLoad: 65529 },
  { time: '17:00', dayAheadPrice: 378.00, realtimePrice: 462.80, spotPrice: 420.40, loadForecast: 67891, actualLoad: 66642 },
  { time: '17:15', dayAheadPrice: 489.60, realtimePrice: 560.90, spotPrice: 525.25, loadForecast: 69642, actualLoad: 68120 },
  { time: '17:30', dayAheadPrice: 703.00, realtimePrice: 612.00, spotPrice: 657.50, loadForecast: 70849, actualLoad: 69415 },
  { time: '17:45', dayAheadPrice: 617.50, realtimePrice: 612.00, spotPrice: 614.75, loadForecast: 71423, actualLoad: 70728 },
  { time: '18:00', dayAheadPrice: 579.69, realtimePrice: 612.00, spotPrice: 595.85, loadForecast: 72340, actualLoad: 71846 },
  { time: '18:15', dayAheadPrice: 564.64, realtimePrice: 612.00, spotPrice: 588.32, loadForecast: 72735, actualLoad: 72721 },
  { time: '18:30', dayAheadPrice: 561.00, realtimePrice: 612.00, spotPrice: 586.50, loadForecast: 73128, actualLoad: 73471 },
  { time: '18:45', dayAheadPrice: 545.20, realtimePrice: 612.00, spotPrice: 578.60, loadForecast: 73838, actualLoad: 74353 },
  { time: '19:00', dayAheadPrice: 554.00, realtimePrice: 612.00, spotPrice: 583.00, loadForecast: 74416, actualLoad: 74696 },
  { time: '19:15', dayAheadPrice: 545.52, realtimePrice: 612.00, spotPrice: 578.76, loadForecast: 75301, actualLoad: 75240 },
  { time: '19:30', dayAheadPrice: 522.80, realtimePrice: 612.00, spotPrice: 567.40, loadForecast: 75781, actualLoad: 76184 },
  { time: '19:45', dayAheadPrice: 568.00, realtimePrice: 612.00, spotPrice: 590.00, loadForecast: 75426, actualLoad: 75704 },
  { time: '20:00', dayAheadPrice: 606.40, realtimePrice: 612.00, spotPrice: 609.20, loadForecast: 75637, actualLoad: 75003 },
  { time: '20:15', dayAheadPrice: 580.80, realtimePrice: 612.00, spotPrice: 596.40, loadForecast: 75482, actualLoad: 74302 },
  { time: '20:30', dayAheadPrice: 620.12, realtimePrice: 612.00, spotPrice: 616.06, loadForecast: 74801, actualLoad: 73864 },
  { time: '20:45', dayAheadPrice: 625.00, realtimePrice: 612.00, spotPrice: 618.50, loadForecast: 74585, actualLoad: 73265 },
  { time: '21:00', dayAheadPrice: 612.16, realtimePrice: 612.00, spotPrice: 612.08, loadForecast: 73670, actualLoad: 72667 },
  { time: '21:15', dayAheadPrice: 634.44, realtimePrice: 612.00, spotPrice: 623.22, loadForecast: 73049, actualLoad: 71949 },
  { time: '21:30', dayAheadPrice: 610.00, realtimePrice: 612.00, spotPrice: 611.00, loadForecast: 71989, actualLoad: 71111 },
  { time: '21:45', dayAheadPrice: 596.48, realtimePrice: 612.00, spotPrice: 604.24, loadForecast: 71062, actualLoad: 70453 },
  { time: '22:00', dayAheadPrice: 608.33, realtimePrice: 612.00, spotPrice: 610.16, loadForecast: 70293, actualLoad: 70812 },
  { time: '22:15', dayAheadPrice: 518.40, realtimePrice: 612.00, spotPrice: 565.20, loadForecast: 69338, actualLoad: 70154 },
  { time: '22:30', dayAheadPrice: 479.40, realtimePrice: 612.00, spotPrice: 545.70, loadForecast: 68083, actualLoad: 68958 },
  { time: '22:45', dayAheadPrice: 445.00, realtimePrice: 612.00, spotPrice: 528.50, loadForecast: 66583, actualLoad: 67462 },
  { time: '23:00', dayAheadPrice: 440.00, realtimePrice: 612.00, spotPrice: 526.00, loadForecast: 68555, actualLoad: 67642 },
  { time: '23:15', dayAheadPrice: 451.80, realtimePrice: 612.00, spotPrice: 531.90, loadForecast: 67423, actualLoad: 66924 },
  { time: '23:30', dayAheadPrice: 422.00, realtimePrice: 537.40, spotPrice: 479.70, loadForecast: 66344, actualLoad: 65727 },
  { time: '23:45', dayAheadPrice: 385.70, realtimePrice: 462.80, spotPrice: 424.25, loadForecast: 65464, actualLoad: 64651 },
];

export const marketPricePoints24: MarketPricePoint[] = marketPricePoints96.filter((point) => point.time.endsWith(':00'));

export const marketPricePoints: MarketPricePoint[] = marketPricePoints24;

export function getMarketPricePoints(mode: MarketPointMode): MarketPricePoint[] {
  return mode === '96' ? marketPricePoints96 : marketPricePoints24;
}

export const supplyDemandItems: SupplyDemandItem[] = [
  { key: 'available', title: '可用供给', value: '81,420', unit: 'MW', status: 'normal' },
  { key: 'demand', title: '预测需求', value: '74,280', unit: 'MW', status: 'warning' },
  { key: 'reserve', title: '旋转备用', value: '6,120', unit: 'MW', status: 'normal' },
  { key: 'net-load', title: '净负荷', value: '68,540', unit: 'MW', status: 'warning', path: '/market-monitoring/supply-demand' },
];

export const supplyDemandSlots: SupplyDemandSlot[] = [
  { timeRange: '00:00-04:00', availableSupply: 76800, forecastDemand: 61200, reserve: 8200, netLoad: 58400, marginRate: 18.6, riskLevel: 'low', suggestion: '低负荷时段，常规跟踪即可。' },
  { timeRange: '04:00-08:00', availableSupply: 78200, forecastDemand: 62800, reserve: 7900, netLoad: 60100, marginRate: 17.2, riskLevel: 'low', suggestion: '新能源出力爬升，关注低价窗口。' },
  { timeRange: '08:00-12:00', availableSupply: 79600, forecastDemand: 70400, reserve: 6800, netLoad: 65200, marginRate: 11.6, riskLevel: 'medium', suggestion: '供需裕度收窄，建议联动价格预测。' },
  { timeRange: '12:00-16:00', availableSupply: 81200, forecastDemand: 69200, reserve: 7200, netLoad: 63800, marginRate: 14.8, riskLevel: 'medium', suggestion: '午间价格偏低，可评估申报策略。' },
  { timeRange: '16:00-18:00', availableSupply: 82400, forecastDemand: 74400, reserve: 6120, netLoad: 68540, marginRate: 9.7, riskLevel: 'high', suggestion: '晚高峰前供需裕度偏低，复核现货申报量价。' },
  { timeRange: '18:00-21:00', availableSupply: 81420, forecastDemand: 75680, reserve: 5360, netLoad: 71820, marginRate: 7.1, riskLevel: 'high', suggestion: '风险时段，建议提高申报校验频率并关注实时价格。' },
  { timeRange: '21:00-24:00', availableSupply: 79200, forecastDemand: 68400, reserve: 6900, netLoad: 64200, marginRate: 13.6, riskLevel: 'medium', suggestion: '高峰回落，持续观察实时出清变化。' },
];

export const tieLineFlows: TieLineFlow[] = [
  { id: 'tie-1', name: '鲁豫通道', direction: '山东 -> 河南', plannedFlow: 4200, actualFlow: 4380, availableCapacity: 4800, utilizationRate: 91.3, status: 'danger', impact: '利用率接近上限，可能压缩省间交易空间。' },
  { id: 'tie-2', name: '鲁冀通道', direction: '河北 -> 山东', plannedFlow: 2600, actualFlow: 2480, availableCapacity: 3600, utilizationRate: 68.9, status: 'normal', impact: '潮流平稳，可作为常规省间购电参考。' },
  { id: 'tie-3', name: '鲁苏通道', direction: '山东 -> 江苏', plannedFlow: 3100, actualFlow: 3280, availableCapacity: 4200, utilizationRate: 78.1, status: 'warning', impact: '利用率抬升，晚高峰需关注断面约束。' },
  { id: 'tie-4', name: '鲁皖通道', direction: '安徽 -> 山东', plannedFlow: 1800, actualFlow: 1660, availableCapacity: 3000, utilizationRate: 55.3, status: 'normal', impact: '剩余容量充足，可继续跟踪交易机会。' },
  { id: 'tie-5', name: '鲁晋通道', direction: '山西 -> 山东', plannedFlow: 3600, actualFlow: 3520, availableCapacity: 4000, utilizationRate: 88.0, status: 'warning', impact: '通道负载偏高，需联动中长期交易确认。' },
  { id: 'tie-6', name: '鲁蒙通道', direction: '内蒙古 -> 山东', plannedFlow: 2200, actualFlow: 2050, availableCapacity: 3600, utilizationRate: 56.9, status: 'normal', impact: '新能源外送保持稳定。' },
];

export const weatherSlots: WeatherSlot[] = [
  { id: 'weather-1', area: '山东全网', timeRange: '08:00-12:00', condition: '晴', temperature: 31.6, windSpeed: 4.8, irradiance: 780, rainProbability: 8, loadImpact: '制冷负荷抬升', renewableImpact: '光伏出力较高', riskLevel: 'medium', suggestion: '午间关注低价窗口和新能源消纳压力。' },
  { id: 'weather-2', area: '鲁中', timeRange: '12:00-16:00', condition: '晴热', temperature: 34.2, windSpeed: 3.1, irradiance: 860, rainProbability: 5, loadImpact: '工商业负荷偏高', renewableImpact: '光伏高位运行', riskLevel: 'medium', suggestion: '结合供需分析复核午后净负荷回升速度。' },
  { id: 'weather-3', area: '鲁西北', timeRange: '16:00-20:00', condition: '多云', temperature: 35.1, windSpeed: 5.6, irradiance: 410, rainProbability: 22, loadImpact: '晚峰制冷负荷高', renewableImpact: '光伏快速回落，风电略有支撑', riskLevel: 'high', suggestion: '晚高峰需关注价格预测上沿和现货申报风险。' },
  { id: 'weather-4', area: '胶东', timeRange: '00:00-06:00', condition: '阴', temperature: 25.8, windSpeed: 7.2, irradiance: 0, rainProbability: 18, loadImpact: '夜间负荷平稳', renewableImpact: '风电出力改善', riskLevel: 'low', suggestion: '低负荷时段保持常规跟踪。' },
  { id: 'weather-5', area: '鲁南', timeRange: '18:00-22:00', condition: '雷阵雨', temperature: 29.4, windSpeed: 6.4, irradiance: 60, rainProbability: 68, loadImpact: '降雨压低部分制冷负荷', renewableImpact: '光伏低位，风电波动加大', riskLevel: 'high', suggestion: '关注新能源波动和实时价格偏差。' },
  { id: 'weather-6', area: '半岛沿海', timeRange: '10:00-14:00', condition: '晴间多云', temperature: 30.3, windSpeed: 8.1, irradiance: 720, rainProbability: 12, loadImpact: '负荷温和抬升', renewableImpact: '风光出力均较好', riskLevel: 'low', suggestion: '可作为省内新能源出力支撑参考。' },
];

export const marketRiskEvents: MarketRiskEvent[] = [
  { id: 'risk-1', title: '09:00 实时价格越限', level: 'high', source: '价格监测', time: '09:08', description: '实时出清价较日前价差扩大至 96.40 元/MWh。', path: '/market-monitoring/prices' },
  { id: 'risk-2', title: '晚高峰供需裕度偏低', level: 'high', source: '供需分析', time: '12:40', description: '18:00-20:00 供需裕度低于 10%，需关注申报风险。', path: '/trading/spot-bid' },
  { id: 'risk-3', title: '联络线利用率接近上限', level: 'medium', source: '跨省联络线', time: '11:25', description: '鲁豫通道利用率达到 91%，后续可能影响省间交易。' },
  { id: 'risk-4', title: '交易申报节点临近', level: 'low', source: '交易日历', time: '13:00', description: '日前申报窗口将在 45 分钟后关闭。' },
];

export const marketQuickLinks: MarketQuickLink[] = [
  { title: '价格监测', path: '/market-monitoring/prices', description: '查看日前、实时与价差曲线' },
  { title: '现货交易申报', path: '/trading/spot-bid', description: '进入现货量价申报' },
  { title: 'D1 曲线申报', path: '/trading/d1-curve', description: '维护 D1 发电曲线' },
  { title: '交易日历', path: '/market-monitoring/trading-calendar', description: '查看关键交易节点' },
];

export const tradingCalendarEvents: TradingCalendarEvent[] = [
  { id: 'calendar-1', time: '09:30', title: '日前价格发布', category: 'disclosure', module: '市场监测', status: 'done', action: '查看价格曲线', path: '/market-monitoring/prices' },
  { id: 'calendar-2', time: '11:00', title: '中长期成交确认', category: 'declaration', module: '交易管理', status: 'done', action: '查看合约台账', path: '/trading/long-term' },
  { id: 'calendar-3', time: '13:45', title: '申报窗口关闭', category: 'declaration', module: '现货交易', status: 'active', action: '进入现货申报', path: '/trading/spot-bid' },
  { id: 'calendar-4', time: '15:30', title: '实时滚动出清', category: 'clearing', module: '市场监测', status: 'pending', action: '跟踪出清价格', path: '/market-monitoring/prices' },
  { id: 'calendar-5', time: '17:00', title: 'D1 曲线提交截止', category: 'declaration', module: '交易管理', status: 'risk', action: '复核 D1 曲线', path: '/trading/d1-curve' },
  { id: 'calendar-6', time: '18:30', title: '结算数据发布', category: 'settlement', module: '结算管理', status: 'pending', action: '查看结算单', path: '/settlement/bills' },
  { id: 'calendar-7', time: '20:00', title: '偏差费用初核', category: 'settlement', module: '结算管理', status: 'pending', action: '进入费用审核', path: '/settlement/rt-fee-check' },
];

export const priceMonitorTabs: PriceMonitorTab[] = [
  { key: 'day-ahead', title: '日前出清价格', description: 'DA 96 点价格曲线与峰谷值' },
  { key: 'realtime', title: '实时出清价格', description: 'RT 价格刷新与异常点' },
  { key: 'spot', title: '现货价格走势', description: 'DA/RT/现货对比趋势' },
  { key: 'bidding', title: '竞价价格分析', description: '申报价与出清价偏离' },
  { key: 'spread', title: '价差分析', description: '日前与实时价差分布' },
  { key: 'ranking', title: '市场价格排名', description: '区域与主体价格排名' },
];

export const priceRankings: PriceRankingItem[] = [
  { rank: 1, name: '鲁中交易单元', area: '鲁中', averagePrice: 416.2, spread: 84.6, status: 'danger' },
  { rank: 2, name: '鲁西北交易单元', area: '鲁西北', averagePrice: 398.7, spread: 62.4, status: 'warning' },
  { rank: 3, name: '胶东交易单元', area: '胶东', averagePrice: 376.1, spread: 39.8, status: 'normal' },
  { rank: 4, name: '鲁南交易单元', area: '鲁南', averagePrice: 352.5, spread: 24.1, status: 'normal' },
];

export function buildPriceSummaryItems(points: MarketPricePoint[]): PriceSummaryItem[] {
  const spotPrices = points.map((point) => point.spotPrice);
  const spreads = points.map((point) => Math.abs(point.realtimePrice - point.dayAheadPrice));
  const average = spotPrices.reduce((sum, price) => sum + price, 0) / spotPrices.length;
  const peak = Math.max(...spotPrices);
  const valley = Math.min(...spotPrices);
  const maxSpread = Math.max(...spreads);

  return [
    { key: 'avg', title: '均价', value: average.toFixed(2), unit: '元/MWh', status: 'normal' },
    { key: 'peak', title: '峰值', value: peak.toFixed(2), unit: '元/MWh', status: peak >= 600 ? 'danger' : 'warning' },
    { key: 'valley', title: '谷值', value: valley.toFixed(2), unit: '元/MWh', status: valley < 0 ? 'warning' : 'normal' },
    { key: 'spread', title: '最大价差', value: maxSpread.toFixed(2), unit: '元/MWh', status: maxSpread >= 100 ? 'danger' : 'warning' },
  ];
}

export function buildPriceDetailRows(points: MarketPricePoint[]): PriceDetailRow[] {
  return points.map((point) => {
  const spread = Number((point.realtimePrice - point.dayAheadPrice).toFixed(2));
  const status = Math.abs(spread) > 100 ? 'danger' : Math.abs(spread) > 40 ? 'warning' : 'normal';

  return {
    time: point.time,
    dayAheadPrice: point.dayAheadPrice,
    realtimePrice: point.realtimePrice,
    volume: Math.round(point.actualLoad / 10),
    spread,
    status,
    remark: status === 'danger' ? '价差越限，建议复核申报策略' : status === 'warning' ? '价差扩大，持续观察' : '运行平稳',
  };
  });
}

export const priceSummaryItems: PriceSummaryItem[] = buildPriceSummaryItems(marketPricePoints);

export const priceDetailRows: PriceDetailRow[] = buildPriceDetailRows(marketPricePoints);

export const priceForecastFilter: PriceForecastFilter = {
  dateRange: ['2026-06-14', '2026-06-14'],
  marketType: 'all',
  area: '山东全网',
  pointMode: '24',
  modelVersion: 'PF-2026.06-A',
  updatedAt: '13:30',
};

export const priceForecastPoints96: PriceForecastPoint[] = marketPricePoints96.map((point, index) => {
  const wave = Math.sin(index / 6) * 18;
  const forecastPrice = Number((point.spotPrice + wave + 10).toFixed(2));
  const actualPrice = index <= 56 ? point.spotPrice : undefined;
  const deviation = actualPrice === undefined ? undefined : Number((forecastPrice - actualPrice).toFixed(2));
  const confidenceWidth = forecastPrice > 520 ? 42 : forecastPrice < 0 ? 28 : 34;
  const riskLevel = forecastPrice >= 580 || Math.abs(deviation ?? 0) >= 60 ? 'high' : forecastPrice >= 450 || Math.abs(deviation ?? 0) >= 35 ? 'medium' : 'low';

  return {
    time: point.time,
    forecastPrice,
    actualPrice,
    deviation,
    confidenceLow: Number((forecastPrice - confidenceWidth).toFixed(2)),
    confidenceHigh: Number((forecastPrice + confidenceWidth).toFixed(2)),
    riskLevel,
    suggestion:
      riskLevel === 'high'
        ? '高价风险时段，建议复核申报策略'
        : riskLevel === 'medium'
          ? '价格波动扩大，建议关注偏差'
          : '预测区间平稳，可按常规策略观察',
  };
});

export const priceForecastPoints24: PriceForecastPoint[] = priceForecastPoints96.filter((point) => point.time.endsWith(':00'));

export function getPriceForecastPoints(mode: MarketPointMode): PriceForecastPoint[] {
  return mode === '96' ? priceForecastPoints96 : priceForecastPoints24;
}

export const priceForecastRisks: PriceForecastRisk[] = [
  {
    id: 'forecast-risk-1',
    timeRange: '17:30-20:45',
    title: '晚高峰预测价格抬升',
    level: 'high',
    description: '预测价格连续处于高位，建议提前复核现货申报量价区间。',
  },
  {
    id: 'forecast-risk-2',
    timeRange: '06:30-15:45',
    title: '低价机会窗口',
    level: 'medium',
    description: '新能源出力影响下价格维持低位，可结合负荷计划评估低价成交机会。',
  },
  {
    id: 'forecast-risk-3',
    timeRange: '16:15-17:15',
    title: '实际与预测偏差扩大',
    level: 'medium',
    description: '爬坡时段预测偏差上升，建议联动价格监测核对实时边界变化。',
  },
];

export function buildPriceForecastSummaryItems(points: PriceForecastPoint[]): PriceSummaryItem[] {
  const forecastPrices = points.map((point) => point.forecastPrice);
  const deviations = points.map((point) => Math.abs(point.deviation ?? 0)).filter((item) => item > 0);
  const average = forecastPrices.reduce((sum, price) => sum + price, 0) / forecastPrices.length;
  const peak = Math.max(...forecastPrices);
  const highRiskCount = points.filter((point) => point.riskLevel === 'high').length;
  const averageDeviation = deviations.length ? deviations.reduce((sum, deviation) => sum + deviation, 0) / deviations.length : 0;

  return [
    { key: 'forecast-average', title: '预测均价', value: average.toFixed(2), unit: '元/MWh', status: average >= 450 ? 'warning' : 'normal' },
    { key: 'forecast-peak', title: '最高预测价', value: peak.toFixed(2), unit: '元/MWh', status: peak >= 580 ? 'danger' : 'warning' },
    { key: 'forecast-risk', title: '高风险时段', value: String(highRiskCount), unit: '个', status: highRiskCount > 0 ? 'danger' : 'normal' },
    { key: 'forecast-deviation', title: '平均预测偏差', value: averageDeviation.toFixed(2), unit: '元/MWh', status: averageDeviation >= 40 ? 'warning' : 'normal' },
  ];
}

export const priceForecastSummaryItems: PriceSummaryItem[] = buildPriceForecastSummaryItems(priceForecastPoints24);
