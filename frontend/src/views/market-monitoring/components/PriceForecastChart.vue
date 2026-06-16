<script setup lang="ts">
import { LineChart } from 'echarts/charts';
import { DataZoomComponent, GridComponent, LegendComponent, MarkLineComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { buildPriceForecastOption } from '../market-monitoring-chart';
import type { PriceForecastPoint } from '../market-monitoring.types';

const props = defineProps<{
  points: PriceForecastPoint[];
}>();

echarts.use([LineChart, GridComponent, LegendComponent, MarkLineComponent, TooltipComponent, DataZoomComponent, CanvasRenderer]);

const chartRef = ref<HTMLDivElement>();
let chart: echarts.ECharts | undefined;

function renderChart() {
  if (!chartRef.value) return;
  chart ??= echarts.init(chartRef.value);
  chart.setOption(buildPriceForecastOption(props.points), true);
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
  <section class="dashboard-card forecast-chart" data-test="price-forecast-chart">
    <div class="dashboard-card__header">
      <h3>预测价格曲线</h3>
      <span>预测价格 / 实际价格 / 置信区间</span>
    </div>
    <div ref="chartRef" class="forecast-chart__body" />
  </section>
</template>

<style scoped>
.forecast-chart__body {
  min-height: 380px;
}
</style>
