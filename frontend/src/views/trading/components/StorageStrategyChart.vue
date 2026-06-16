<script setup lang="ts">
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { buildStorageStrategyOption } from '../trading-chart';
import type { SpotBidPoint, StorageStrategyResponse } from '../trading.types';

const props = defineProps<{
  points: SpotBidPoint[];
  result: StorageStrategyResponse;
}>();

echarts.use([LineChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

const chartRef = ref<HTMLDivElement>();
let chart: echarts.ECharts | undefined;

function renderChart() {
  if (!chartRef.value) return;
  chart ??= echarts.init(chartRef.value);
  chart.setOption(buildStorageStrategyOption(props.points, props.result), true);
}

onMounted(() => {
  renderChart();
  window.addEventListener('resize', renderChart);
});

watch(() => [props.points, props.result], renderChart, { deep: true });

onBeforeUnmount(() => {
  window.removeEventListener('resize', renderChart);
  chart?.dispose();
  chart = undefined;
});
</script>

<template>
  <section class="dashboard-card storage-chart">
    <div class="dashboard-card__header">
      <h3>充放电策略曲线</h3>
      <span>功率 / SOC / 预测价格</span>
    </div>
    <div ref="chartRef" class="storage-chart__canvas" />
  </section>
</template>

<style scoped>
.storage-chart__canvas {
  min-height: 300px;
}
</style>
