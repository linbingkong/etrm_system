export type TradingPointMode = '24' | '96';
export type TradingMarketType = 'dayAhead' | 'realtime';
export type SubmitStatus = 'draft' | 'validating' | 'ready' | 'submitted' | 'rejected';
export type TradingStatus = 'normal' | 'warning' | 'danger' | 'success';

export interface TradingSession {
  tradeDate: string;
  marketType: TradingMarketType;
  roundName: string;
  windowStatus: 'open' | 'closing' | 'closed';
  updatedAt: string;
  pointMode?: TradingPointMode;
}

export interface TradingKpi {
  key: string;
  title: string;
  value: string;
  unit?: string;
  status: TradingStatus;
  description: string;
}

export interface TradingProgressStep {
  key: string;
  title: string;
  status: 'done' | 'active' | 'pending' | 'blocked';
  description: string;
}

export interface TradingRisk {
  id: string;
  title: string;
  level: 'high' | 'medium' | 'low';
  source: string;
  time: string;
  path?: string;
}

export interface TradingTodo {
  id: string;
  title: string;
  module: string;
  priority: 'high' | 'medium' | 'low';
  dueText: string;
  path: string;
}

export interface LongTermTradeContract {
  id: string;
  variety: string;
  counterparty: string;
  period: string;
  volumeMwh: number;
  price: number;
  progress: number;
  status: 'executing' | 'pending-confirm' | 'completed' | 'warning';
}

export interface TradingWorkItem {
  id: string;
  title: string;
  module: string;
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  owner: string;
  status: 'todo' | 'processing' | 'done' | 'returned';
  result?: string;
  relatedNo: string;
  path: string;
}

export interface TradingConstraintRule {
  id: string;
  category: 'unit' | 'storage' | 'price' | 'declaration';
  name: string;
  target: string;
  parameter: string;
  limitText: string;
  effectivePeriod: string;
  impactModule: string;
  status: 'active' | 'review' | 'warning' | 'disabled';
  owner: string;
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

export interface ValidationItem {
  key: string;
  title: string;
  status: TradingStatus;
  description: string;
}

export interface StorageBidSegment {
  p_start: number;
  p_end: number;
  price: number;
}

export interface StorageStrategyRequest {
  market_date: string;
  station_id: string;
  node_id: string;
  time_step_min: 15;
  p_charge_max_mw: number;
  p_discharge_max_mw: number;
  storage_capacity_mwh: number;
  soc_initial: number;
  soc_min: number;
  soc_max: number;
  soc_terminal_target: number | null;
  eta_charge: number;
  eta_discharge: number;
  price_floor: number;
  price_cap: number;
  charge_price_signal: number[];
  discharge_price_signal: number[];
  degradation_cost_yuan_per_mwh: number;
  variable_fee_yuan_per_mwh: number;
  risk_margin_yuan_per_mwh: number;
  required_profit_spread_yuan_per_mwh: number;
  trading_strategy: 'conservative' | 'balanced' | 'aggressive';
  min_charge_steps: number;
  min_discharge_steps: number;
  min_idle_steps: number;
  solver_time_limit_sec: number;
  mip_gap: number;
  merge_price_gap_yuan_per_mwh: number;
}

export interface StorageStrategyResponse {
  station_id: string;
  node_id: string;
  market_date: string;
  strategy: string;
  validation_passed: boolean;
  validation_errors: string[];
  submission_packet: {
    daily_params?: Record<string, number | string | null>;
    [key: string]: unknown;
  };
  charge_segments: StorageBidSegment[];
  discharge_segments: StorageBidSegment[];
  derived_feasible_power_mw: number[];
  derived_soc: number[];
}

export interface StorageStrategyDraft {
  id: string;
  name: string;
  status: 'draft' | 'generated' | 'error';
  updatedAt: string;
}

export type StorageStrategyStage = 'parameters' | 'strategy' | 'profit';

export interface StorageSavedStrategy extends StorageStrategyDraft {
  request: StorageStrategyRequest;
  result: StorageStrategyResponse;
  stage: StorageStrategyStage;
}
