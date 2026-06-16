<script setup lang="ts">
import { computed, ref } from 'vue';

import MarketFilterBar from './components/MarketFilterBar.vue';
import PriceDetailTable from './components/PriceDetailTable.vue';
import PriceMonitorTabs from './components/PriceMonitorTabs.vue';
import PriceRankingTable from './components/PriceRankingTable.vue';
import PriceSummaryPanel from './components/PriceSummaryPanel.vue';
import {
  buildPriceDetailRows,
  buildPriceSummaryItems,
  getMarketPricePoints,
  marketFilter,
  priceMonitorTabs,
  priceRankings,
} from './market-monitoring.mock';
import type { MarketPointMode } from './market-monitoring.types';

const pointMode = ref<MarketPointMode>('24');
const currentPoints = computed(() => getMarketPricePoints(pointMode.value));
const currentFilter = computed(() => ({
  ...marketFilter,
  interval: pointMode.value === '96' ? ('15m' as const) : ('1h' as const),
}));
const currentSummaryItems = computed(() => buildPriceSummaryItems(currentPoints.value));
const currentDetailRows = computed(() => buildPriceDetailRows(currentPoints.value));
</script>

<template>
  <section class="market-page">
    <header class="market-page__title">
      <div>
        <p>Price Monitoring</p>
        <h2>价格监测</h2>
      </div>
      <div class="market-page__actions">
        <span>日前 / 实时 / 价差 / 排名</span>
        <div class="point-mode" aria-label="点数切换">
          <button :class="{ active: pointMode === '24' }" type="button" @click="pointMode = '24'">24点</button>
          <button :class="{ active: pointMode === '96' }" type="button" @click="pointMode = '96'">96点</button>
        </div>
        <button type="button" disabled title="当前账号无导出权限">导出</button>
      </div>
    </header>

    <MarketFilterBar :filter="currentFilter" />
    <PriceSummaryPanel :items="currentSummaryItems" />

    <div class="market-page__content-grid">
      <PriceMonitorTabs :tabs="priceMonitorTabs" :points="currentPoints" />
      <PriceRankingTable :rows="priceRankings" />
    </div>
    <PriceDetailTable :rows="currentDetailRows" />
  </section>
</template>

<style scoped>
.market-page {
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

.market-page__title {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
}

.market-page__title p,
.market-page__title span {
  margin: 0;
  color: var(--color-muted);
  font-size: 12px;
}

.market-page__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.market-page__actions > button,
.point-mode button {
  border: 1px solid rgba(143, 155, 186, 0.24);
  border-radius: 4px;
  padding: 8px 12px;
  color: rgba(143, 155, 186, 0.7);
  background: rgba(255, 255, 255, 0.03);
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

.market-page__actions > button {
  cursor: not-allowed;
}

.market-page__title h2 {
  margin: 4px 0 0;
  color: #ffffff;
  font-size: 24px;
}

.market-page__content-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(340px, 1fr);
  gap: 16px;
}

@media (max-width: 1280px) {
  .market-page__content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
