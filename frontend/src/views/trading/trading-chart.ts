import type { EChartsOption } from 'echarts';

import type { D1CurvePoint, SpotBidPoint, StorageStrategyResponse } from './trading.types';

const axisLabel = { color: '#8F9BBA' };
const splitLine = { lineStyle: { color: 'rgba(143, 155, 186, 0.12)' } };

export function buildSpotBidOption(points: SpotBidPoint[]): EChartsOption {
  return {
    backgroundColor: 'transparent',
    animationDuration: 1600,
    animationEasing: 'cubicOut',
    color: ['#00F2FE', '#FFB300', '#FF3860'],
    tooltip: { trigger: 'axis' },
    legend: { top: 0, textStyle: { color: '#8F9BBA' } },
    grid: { top: 48, right: 48, bottom: 32, left: 56 },
    xAxis: { type: 'category', boundaryGap: false, data: points.map((point) => point.time), axisLabel },
    yAxis: [
      { type: 'value', name: 'MWh', axisLabel, splitLine },
      { type: 'value', name: '元/MWh', axisLabel, splitLine: { show: false } },
    ],
    series: [
      { name: '申报电量', type: 'line', smooth: true, data: points.map((point) => point.bidVolume), areaStyle: { color: 'rgba(0, 242, 254, 0.14)' } },
      { name: '参考价格', type: 'line', yAxisIndex: 1, smooth: true, data: points.map((point) => point.referencePrice) },
      {
        name: '申报价格',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: points.map((point) => point.bidPrice),
        markLine: {
          symbol: 'none',
          lineStyle: { color: '#FF3860', type: 'dashed' as const },
          data: [{ yAxis: 650, name: '最高限价' }, { yAxis: -80, name: '最低限价' }],
        },
      },
    ],
  };
}

export function buildD1CurveOption(points: D1CurvePoint[]): EChartsOption {
  return {
    backgroundColor: 'transparent',
    animationDuration: 1600,
    animationEasing: 'cubicOut',
    color: ['#00F2FE', '#FFB300', '#FF3860'],
    tooltip: { trigger: 'axis' },
    legend: { top: 0, textStyle: { color: '#8F9BBA' } },
    grid: { top: 48, right: 48, bottom: 32, left: 56 },
    xAxis: { type: 'category', boundaryGap: false, data: points.map((point) => point.time), axisLabel },
    yAxis: [
      { type: 'value', name: 'MW', axisLabel, splitLine },
      { type: 'value', name: '偏差', axisLabel, splitLine: { show: false } },
    ],
    series: [
      { name: '计划曲线', type: 'line', smooth: true, data: points.map((point) => point.planPower) },
      { name: '申报曲线', type: 'line', smooth: true, data: points.map((point) => point.declaredPower), areaStyle: { color: 'rgba(0, 242, 254, 0.12)' } },
      { name: '偏差', type: 'bar', yAxisIndex: 1, data: points.map((point) => point.deviation) },
    ],
  };
}

export function buildStoragePowerOption(points: SpotBidPoint[]): EChartsOption {
  return {
    backgroundColor: 'transparent',
    animationDuration: 1600,
    animationEasing: 'cubicOut',
    color: ['#00F2FE', '#FFB300'],
    tooltip: { trigger: 'axis' },
    legend: { top: 0, textStyle: { color: '#8F9BBA' } },
    grid: { top: 48, right: 48, bottom: 32, left: 56 },
    xAxis: { type: 'category', boundaryGap: false, data: points.map((point) => point.time), axisLabel },
    yAxis: { type: 'value', name: '元/MWh', axisLabel, splitLine },
    series: [
      { name: '预测日前电价', type: 'line', smooth: true, data: points.map((point) => point.referencePrice), areaStyle: { color: 'rgba(0, 242, 254, 0.12)' } },
      { name: '放电价格信号', type: 'line', smooth: true, data: points.map((point) => Number((point.referencePrice + 35).toFixed(2))) },
    ],
  };
}

export function buildStorageStrategyOption(points: SpotBidPoint[], result: StorageStrategyResponse): EChartsOption {
  return {
    backgroundColor: 'transparent',
    animationDuration: 1600,
    animationEasing: 'cubicOut',
    color: ['#00F2FE', '#FFB300', '#00E676'],
    tooltip: { trigger: 'axis' },
    legend: { top: 0, textStyle: { color: '#8F9BBA' } },
    grid: { top: 48, right: 52, bottom: 32, left: 56 },
    xAxis: { type: 'category', boundaryGap: false, data: points.map((point) => point.time), axisLabel },
    yAxis: [
      { type: 'value', name: 'MW', axisLabel, splitLine },
      { type: 'value', name: 'SOC', axisLabel, splitLine: { show: false } },
    ],
    series: [
      { name: '充放电功率', type: 'line', smooth: true, data: result.derived_feasible_power_mw, areaStyle: { color: 'rgba(0, 242, 254, 0.12)' } },
      { name: 'SOC', type: 'line', yAxisIndex: 1, smooth: true, data: result.derived_soc.slice(1) },
      { name: '预测日前电价', type: 'line', smooth: true, data: points.map((point) => point.referencePrice) },
    ],
  };
}
