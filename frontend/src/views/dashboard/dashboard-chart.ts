import type { ComposeOption } from 'echarts/core';
import type { GridComponentOption, LegendComponentOption, MarkLineComponentOption, TooltipComponentOption } from 'echarts/components';
import type { LineSeriesOption } from 'echarts/charts';

import type { TrendPoint } from './dashboard.types';

type PriceTrendOption = ComposeOption<
  GridComponentOption | LegendComponentOption | MarkLineComponentOption | TooltipComponentOption | LineSeriesOption
>;

export function buildPriceTrendOption(points: TrendPoint[]): PriceTrendOption {
  const xAxisData = points.map((point) => point.time);
  const limitPrice = points.find((point) => point.limitPrice !== undefined)?.limitPrice ?? 520;

  return {
    backgroundColor: 'transparent',
    color: ['#00F2FE', '#FFB300'],
    animationDuration: 2000,
    animationEasing: 'cubicOut',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(17, 28, 68, 0.95)',
      borderColor: 'rgba(0, 242, 254, 0.25)',
      textStyle: { color: '#ffffff' },
    },
    legend: {
      top: 0,
      right: 0,
      textStyle: { color: '#8F9BBA' },
    },
    grid: {
      top: 44,
      right: 20,
      bottom: 28,
      left: 48,
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLine: { lineStyle: { color: 'rgba(143, 155, 186, 0.35)' } },
      axisLabel: { color: '#8F9BBA' },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      name: '元/MWh',
      nameTextStyle: { color: '#8F9BBA' },
      splitLine: { lineStyle: { color: 'rgba(143, 155, 186, 0.12)' } },
      axisLabel: { color: '#8F9BBA' },
    },
    series: [
      {
        name: '日前价格',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: points.map((point) => point.dayAheadPrice),
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 242, 254, 0.2)' },
              { offset: 1, color: 'rgba(0, 0, 0, 0)' },
            ],
          },
        },
        markLine: {
          symbol: 'none',
          lineStyle: { color: '#FF3860', type: 'dashed' },
          label: { color: '#FF3860', formatter: '限价 {c}' },
          data: [{ yAxis: limitPrice }],
        },
      },
      {
        name: '实时价格',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: points.map((point) => point.realtimePrice),
      },
    ],
  };
}
