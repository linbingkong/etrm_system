<script setup lang="ts">
import { computed, ref } from 'vue';

import PriceForecastChart from './components/PriceForecastChart.vue';
import PriceForecastRiskPanel from './components/PriceForecastRiskPanel.vue';
import PriceForecastTable from './components/PriceForecastTable.vue';
import PriceSummaryPanel from './components/PriceSummaryPanel.vue';
import {
  buildPriceForecastSummaryItems,
  getPriceForecastPoints,
  priceForecastFilter,
  priceForecastRisks,
} from './market-monitoring.mock';
import type { MarketPointMode } from './market-monitoring.types';

const pointMode = ref<MarketPointMode>('24');

const currentFilter = computed(() => ({
  ...priceForecastFilter,
  pointMode: pointMode.value,
}));
const currentPoints = computed(() => getPriceForecastPoints(pointMode.value));
const summaryItems = computed(() => buildPriceForecastSummaryItems(currentPoints.value));
</script>

<template>
  <section class="forecast-page">
    <header class="forecast-page__title">
      <div>
        <p>Price Forecast</p>
        <h2>价格预测</h2>
      </div>
      <div class="forecast-page__actions">
        <span>辅助交易决策 / 预测偏差 / 风险时段</span>
        <div class="point-mode" aria-label="点数切换">
          <button :class="{ active: pointMode === '24' }" type="button" @click="pointMode = '24'">24点</button>
          <button :class="{ active: pointMode === '96' }" type="button" @click="pointMode = '96'">96点</button>
        </div>
        <button type="button" disabled title="当前账号无导出权限">导出</button>
      </div>
    </header>

    <section class="dashboard-card forecast-filter" data-test="price-forecast-filter">
      <div>
        <span>交易日期范围</span>
        <strong>{{ currentFilter.dateRange[0] }} 至 {{ currentFilter.dateRange[1] }}</strong>
      </div>
      <div>
        <span>市场类型</span>
        <strong>{{ currentFilter.marketType === 'all' ? '日前 + 实时' : currentFilter.marketType }}</strong>
      </div>
      <div>
        <span>区域/节点</span>
        <strong>{{ currentFilter.area }}</strong>
      </div>
      <div>
        <span>时间粒度</span>
        <strong>{{ currentFilter.pointMode }}点</strong>
      </div>
      <div>
        <span>模型版本</span>
        <strong>{{ currentFilter.modelVersion }}</strong>
      </div>
      <div>
        <span>更新时间</span>
        <strong>{{ currentFilter.updatedAt }}</strong>
      </div>
    </section>

    <PriceSummaryPanel :items="summaryItems" data-test="price-forecast-summary" />

    <div class="forecast-page__content-grid">
      <PriceForecastChart :points="currentPoints" />
      <PriceForecastRiskPanel :risks="priceForecastRisks" />
    </div>

    <PriceForecastTable :rows="currentPoints" />
  </section>
</template>

<style scoped>
.forecast-page {
  display: grid;
  min-height: calc(100vh - 96px);
  gap: 16px;
  padding: 4px;
  color: #ffffff;
  background:
    linear-gradient(rgba(0, 242, 254, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 242, 254, 0.04) 1px, transparent 1px),
    var(--theme-bg);
  background-size: 28px 28px;
}

.forecast-page__title {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
}

.forecast-page__title p,
.forecast-page__title span {
  margin: 0;
  color: var(--color-muted);
  font-size: 12px;
}

.forecast-page__title h2 {
  margin: 4px 0 0;
  color: #ffffff;
  font-size: 24px;
}

.forecast-page__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.forecast-page__actions > button,
.point-mode button {
  border: 1px solid rgba(143, 155, 186, 0.24);
  border-radius: 4px;
  padding: 8px 12px;
  color: rgba(143, 155, 186, 0.7);
  background: rgba(255, 255, 255, 0.03);
}

.forecast-page__actions > button {
  cursor: not-allowed;
}

.point-mode {
  display: flex;
  gap: 6px;
}

.point-mode button {
  color: var(--color-muted);
  cursor: pointer;
}

.point-mode button.active {
  border-color: rgba(0, 242, 254, 0.45);
  color: var(--color-primary);
  box-shadow: var(--shadow-glow);
}

.forecast-filter {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
}

.forecast-filter div {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.forecast-filter span {
  color: var(--color-muted);
  font-size: 12px;
}

.forecast-filter strong {
  overflow: hidden;
  color: #ffffff;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.forecast-page__content-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(340px, 1fr);
  gap: 16px;
}

@media (max-width: 1280px) {
  .forecast-page__content-grid,
  .forecast-filter {
    grid-template-columns: 1fr;
  }

  .forecast-page__title {
    align-items: start;
    flex-direction: column;
  }
}
</style>
