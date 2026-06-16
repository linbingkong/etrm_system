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
