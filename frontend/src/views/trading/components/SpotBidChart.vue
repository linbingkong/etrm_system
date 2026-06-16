<script setup lang="ts">
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, MarkLineComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { buildSpotBidOption } from '../trading-chart';
import type { SpotBidPoint } from '../trading.types';

const props = defineProps<{
  points: SpotBidPoint[];
}>();

echarts.use([LineChart, GridComponent, LegendComponent, MarkLineComponent, TooltipComponent, CanvasRenderer]);

const chartRef = ref<HTMLDivElement>();
let chart: echarts.ECharts | undefined;

function renderChart() {
  if (!chartRef.value) return;
  chart ??= echarts.init(chartRef.value);
  chart.setOption(buildSpotBidOption(props.points), true);
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
      <h3>申报曲线</h3>
      <span>电量 / 价格 / 限价</span>
    </div>
    <div ref="chartRef" class="trading-chart__canvas" />
  </section>
</template>

<style scoped>
.trading-chart__canvas {
  min-height: 340px;
}
</style>
