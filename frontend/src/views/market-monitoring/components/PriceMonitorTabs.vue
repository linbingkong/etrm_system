<script setup lang="ts">
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, MarkLineComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { buildPriceMonitorOption } from '../market-monitoring-chart';
import type { MarketPricePoint, PriceMonitorTab } from '../market-monitoring.types';

const props = defineProps<{
  tabs: PriceMonitorTab[];
  points: MarketPricePoint[];
}>();

echarts.use([LineChart, BarChart, GridComponent, LegendComponent, MarkLineComponent, TooltipComponent, CanvasRenderer]);

const activeTab = ref(props.tabs[0]?.key ?? '');
const chartRef = ref<HTMLDivElement>();
let chart: echarts.ECharts | undefined;

function renderChart() {
  if (!chartRef.value) return;
  chart ??= echarts.init(chartRef.value);
  chart.setOption(buildPriceMonitorOption(activeTab.value, props.points), true);
}

onMounted(() => {
  renderChart();
  window.addEventListener('resize', renderChart);
});

watch(() => props.points, renderChart, { deep: true });
watch(activeTab, renderChart);

onBeforeUnmount(() => {
  window.removeEventListener('resize', renderChart);
  chart?.dispose();
  chart = undefined;
});
</script>

<template>
  <section class="dashboard-card price-tabs" data-test="price-monitor-tabs">
    <div class="price-tabs__nav">
      <button v-for="tab in tabs" :key="tab.key" :class="{ active: activeTab === tab.key }" type="button" @click="activeTab = tab.key">
        {{ tab.title }}
      </button>
    </div>
    <div ref="chartRef" class="price-tabs__chart" />
  </section>
</template>

<style scoped>
.price-tabs__nav {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 12px;
}

.price-tabs__nav button {
  flex: 0 0 auto;
  border: 1px solid var(--border-glow);
  border-radius: 4px;
  padding: 8px 12px;
  color: var(--color-muted);
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
}

.price-tabs__nav button.active {
  color: var(--color-primary);
  border-color: rgba(0, 242, 254, 0.45);
  box-shadow: var(--shadow-glow);
}

.price-tabs__chart {
  min-height: 340px;
}
</style>
