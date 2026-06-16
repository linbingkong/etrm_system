<script setup lang="ts">
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { buildD1CurveOption } from '../trading-chart';
import type { D1CurvePoint } from '../trading.types';

const props = defineProps<{
  points: D1CurvePoint[];
}>();

echarts.use([LineChart, BarChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

const chartRef = ref<HTMLDivElement>();
let chart: echarts.ECharts | undefined;

function renderChart() {
  if (!chartRef.value) return;
  chart ??= echarts.init(chartRef.value);
  chart.setOption(buildD1CurveOption(props.points), true);
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
  <section class="dashboard-card trading-chart">
    <div class="dashboard-card__header">
      <h3>D1 曲线</h3>
      <span>计划 / 申报 / 偏差</span>
    </div>
    <div ref="chartRef" class="trading-chart__canvas" />
  </section>
</template>

<style scoped>
.trading-chart__canvas {
  min-height: 340px;
}
</style>
