import type { EChartsOption } from 'echarts';

import type { MarketPricePoint, PriceForecastPoint } from './market-monitoring.types';

const axisLabel = { color: '#8F9BBA' };
const splitLine = { lineStyle: { color: 'rgba(143, 155, 186, 0.12)' } };

export function buildMarketOverviewOption(points: MarketPricePoint[]): EChartsOption {
  return {
    backgroundColor: 'transparent',
    animationDuration: 2000,
    animationEasing: 'cubicOut',
    color: ['#00F2FE', '#FFB300', '#0072FF', '#00E676'],
    tooltip: { trigger: 'axis' },
    legend: { top: 0, textStyle: { color: '#8F9BBA' } },
    grid: { top: 48, right: 52, bottom: 32, left: 56 },
    xAxis: { type: 'category', boundaryGap: false, data: points.map((item) => item.time), axisLabel },
    yAxis: [
      { type: 'value', name: '元/MWh', axisLabel, splitLine },
      { type: 'value', name: 'MW', axisLabel, splitLine: { show: false } },
    ],
    series: [
      {
        name: '日前价格',
        type: 'line',
        smooth: true,
        data: points.map((item) => item.dayAheadPrice),
        areaStyle: { color: 'rgba(0, 242, 254, 0.14)' },
        markLine: {
          symbol: 'none',
          lineStyle: { color: '#FF3860', type: 'dashed' },
          data: [{ yAxis: 450, name: '风险阈值' }],
        },
      },
      { name: '实时价格', type: 'line', smooth: true, data: points.map((item) => item.realtimePrice) },
      { name: '负荷预测', type: 'line', yAxisIndex: 1, smooth: true, lineStyle: { type: 'dashed' }, data: points.map((item) => item.loadForecast) },
      { name: '实际负荷', type: 'line', yAxisIndex: 1, smooth: true, data: points.map((item) => item.actualLoad) },
    ],
  };
}

export function buildPriceForecastOption(points: PriceForecastPoint[]): EChartsOption {
  return {
    backgroundColor: 'transparent',
    animationDuration: 2000,
    animationEasing: 'cubicOut',
    color: ['#FFB300', '#00F2FE', 'rgba(255, 179, 0, 0.18)', '#FF3860'],
    tooltip: { trigger: 'axis' },
    legend: { top: 0, textStyle: { color: '#8F9BBA' } },
    grid: { top: 48, right: 36, bottom: 44, left: 56 },
    dataZoom: [{ type: 'inside' }, { type: 'slider', height: 16, bottom: 8, borderColor: 'rgba(143, 155, 186, 0.2)' }],
    xAxis: { type: 'category', boundaryGap: false, data: points.map((item) => item.time), axisLabel },
    yAxis: { type: 'value', name: '元/MWh', axisLabel, splitLine },
    series: [
      {
        name: '置信区间下限',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { opacity: 0 },
        stack: 'confidence',
        data: points.map((item) => item.confidenceLow),
      },
      {
        name: '置信区间上限',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { opacity: 0 },
        areaStyle: { color: 'rgba(255, 179, 0, 0.16)' },
        stack: 'confidence',
        data: points.map((item) => Number((item.confidenceHigh - item.confidenceLow).toFixed(2))),
      },
      {
        name: '预测价格',
        type: 'line',
        smooth: true,
        data: points.map((item) => item.forecastPrice),
        markLine: {
          symbol: 'none',
          lineStyle: { color: '#FF3860', type: 'dashed' },
          data: [{ yAxis: 580, name: '高价风险阈值' }],
        },
      },
      {
        name: '实际价格',
        type: 'line',
        smooth: true,
        connectNulls: false,
        data: points.map((item) => item.actualPrice ?? null),
      },
    ],
  };
}

export function buildPriceMonitorOption(tabKey: string, points: MarketPricePoint[]): EChartsOption {
  const seriesByTab: Record<string, NonNullable<EChartsOption['series']>> = {
    'day-ahead': [
      {
        name: '日前价格',
        type: 'line',
        smooth: true,
        data: points.map((item) => item.dayAheadPrice),
        markLine: priceLimitMarkLine(),
      },
    ],
    realtime: [
      {
        name: '实时价格',
        type: 'line',
        smooth: true,
        data: points.map((item) => item.realtimePrice),
        markLine: priceLimitMarkLine(),
      },
    ],
    spot: [
      { name: '日前价格', type: 'line', smooth: true, data: points.map((item) => item.dayAheadPrice) },
      { name: '实时价格', type: 'line', smooth: true, data: points.map((item) => item.realtimePrice) },
      { name: '现货价格', type: 'line', smooth: true, data: points.map((item) => item.spotPrice) },
    ],
    bidding: [
      { name: '申报参考价', type: 'bar', data: points.map((item) => Number((item.dayAheadPrice * 0.96).toFixed(2))) },
      { name: '出清价格', type: 'line', smooth: true, data: points.map((item) => item.realtimePrice), markLine: priceLimitMarkLine() },
    ],
    spread: [
      {
        name: '价差',
        type: 'bar',
        data: points.map((item) => Number((item.realtimePrice - item.dayAheadPrice).toFixed(2))),
        markLine: {
          symbol: 'none',
          lineStyle: { color: '#FFB300', type: 'dashed' },
          data: [{ yAxis: 60, name: '价差预警' }],
        },
      },
    ],
    ranking: [
      { name: '均价排名参考', type: 'bar', data: points.map((item) => item.spotPrice) },
    ],
  };

  const series = seriesByTab[tabKey] ?? seriesByTab.spot;

  return {
    backgroundColor: 'transparent',
    animationDuration: 2000,
    animationEasing: 'cubicOut',
    color: ['#00F2FE', '#FFB300', '#00E676', '#FF3860', '#0072FF'],
    tooltip: { trigger: 'axis' },
    legend: { top: 0, textStyle: { color: '#8F9BBA' } },
    grid: { top: 48, right: 36, bottom: 32, left: 56 },
    xAxis: { type: 'category', boundaryGap: false, data: points.map((item) => item.time), axisLabel },
    yAxis: { type: 'value', name: '元/MWh', axisLabel, splitLine },
    series,
  };
}

function priceLimitMarkLine() {
  return {
    symbol: 'none',
    lineStyle: { color: '#FF3860', type: 'dashed' as const },
    data: [{ yAxis: 450, name: '最高限价' }],
  };
}
