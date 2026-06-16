<script setup lang="ts">
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, MarkLineComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { buildMarketOverviewOption } from '../market-monitoring-chart';
import type { MarketPricePoint } from '../market-monitoring.types';

const props = defineProps<{
  points: MarketPricePoint[];
}>();

echarts.use([LineChart, BarChart, GridComponent, LegendComponent, MarkLineComponent, TooltipComponent, CanvasRenderer]);

const chartRef = ref<HTMLDivElement>();
let chart: echarts.ECharts | undefined;

function renderChart() {
  if (!chartRef.value) return;
  chart ??= echarts.init(chartRef.value);
  chart.setOption(buildMarketOverviewOption(props.points));
}

onMounted(() => {
  renderChart();
  window.addEventListener('resize', renderChart);
});

watch(() => props.points, renderChart, { deep: true });

onBeforeUnmount(() => {
  window.removeEventListener('resize', renderChart);
  chart?.dispose();
  chart = undefined;
});
</script>

<template>
  <section class="dashboard-card market-trend">
    <div class="dashboard-card__header">
      <h3>日前 / 实时价格与负荷趋势</h3>
      <span>元/MWh · MW</span>
    </div>
    <div ref="chartRef" class="market-trend__chart" data-test="market-trend-chart" />
  </section>
</template>

<style scoped>
.market-trend__chart {
  min-height: 360px;
}

@media (max-width: 720px) {
  .market-trend__chart {
    min-height: 280px;
  }
}
</style>
