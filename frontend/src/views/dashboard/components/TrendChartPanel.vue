<script setup lang="ts">
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, MarkLineComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { buildPriceTrendOption } from '../dashboard-chart';
import type { TrendPoint } from '../dashboard.types';

const props = defineProps<{
  points: TrendPoint[];
}>();

echarts.use([LineChart, GridComponent, LegendComponent, MarkLineComponent, TooltipComponent, CanvasRenderer]);

const chartRef = ref<HTMLDivElement>();
let chart: echarts.ECharts | undefined;

function renderChart() {
  if (!chartRef.value) return;
  chart ??= echarts.init(chartRef.value);
  chart.setOption(buildPriceTrendOption(props.points));
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
  <section class="dashboard-card trend-panel">
    <div class="dashboard-card__header">
      <h3>日前 / 实时价格趋势</h3>
      <span>元/MWh</span>
    </div>
    <div ref="chartRef" class="trend-panel__chart" data-test="trend-chart" />
  </section>
</template>

<style scoped>
.trend-panel__chart {
  min-height: 360px;
}

@media (max-width: 720px) {
  .trend-panel__chart {
    min-height: 280px;
  }
}
</style>
