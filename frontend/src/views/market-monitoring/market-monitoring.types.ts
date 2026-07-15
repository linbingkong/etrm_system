export type MarketPointMode = '24' | '96';

export interface MarketFilter {
  tradeDate: string;
  marketType: 'dayAhead' | 'realtime' | 'spot';
  interval: '15m' | '1h';
  area: string;
  updatedAt: string;
  autoRefresh: boolean;
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
  spotPrice: number;
  loadForecast: number;
  actualLoad: number;
}

export interface SupplyDemandItem {
  key: string;
  title: string;
  value: string;
  unit: string;
  status: 'normal' | 'success' | 'warning' | 'danger';
  path?: string;
}

export interface SupplyDemandSlot {
  timeRange: string;
  availableSupply: number;
  forecastDemand: number;
  reserve: number;
  netLoad: number;
  marginRate: number;
  riskLevel: 'low' | 'medium' | 'high';
  suggestion: string;
}

export interface TieLineFlow {
  id: string;
  name: string;
  direction: string;
  plannedFlow: number;
  actualFlow: number;
  availableCapacity: number;
  utilizationRate: number;
  status: 'normal' | 'warning' | 'danger';
  impact: string;
}

export interface WeatherSlot {
  id: string;
  area: string;
  timeRange: string;
  condition: string;
  temperature: number;
  windSpeed: number;
  irradiance: number;
  rainProbability: number;
  loadImpact: string;
  renewableImpact: string;
  riskLevel: 'low' | 'medium' | 'high';
  suggestion: string;
}

export interface MarketRiskEvent {
  id: string;
  title: string;
  level: 'high' | 'medium' | 'low';
  source: string;
  time: string;
  description: string;
  path?: string;
}

export interface MarketQuickLink {
  title: string;
  path: string;
  description: string;
}

export interface TradingCalendarEvent {
  id: string;
  time: string;
  title: string;
  category: 'declaration' | 'clearing' | 'settlement' | 'disclosure';
  module: string;
  status: 'done' | 'active' | 'pending' | 'risk';
  action: string;
  path: string;
}

export interface PriceMonitorTab {
  key: string;
  title: string;
  description: string;
}

export interface PriceRankingItem {
  rank: number;
  name: string;
  area: string;
  averagePrice: number;
  spread: number;
  status: 'normal' | 'warning' | 'danger';
}

export interface PriceSummaryItem {
  key: string;
  title: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'danger';
}

export interface PriceDetailRow {
  time: string;
  dayAheadPrice: number;
  realtimePrice: number;
  volume: number;
  spread: number;
  status: 'normal' | 'warning' | 'danger';
  remark: string;
}

export interface PriceForecastFilter {
  dateRange: [string, string];
  marketType: 'dayAhead' | 'realtime' | 'all';
  area: string;
  pointMode: MarketPointMode;
  modelVersion: string;
  updatedAt: string;
}

export interface PriceForecastPoint {
  time: string;
  forecastPrice: number;
  actualPrice?: number;
  deviation?: number;
  confidenceLow: number;
  confidenceHigh: number;
  riskLevel: 'low' | 'medium' | 'high';
  suggestion: string;
}

export interface PriceForecastRisk {
  id: string;
  timeRange: string;
  title: string;
  level: 'low' | 'medium' | 'high';
  description: string;
}
