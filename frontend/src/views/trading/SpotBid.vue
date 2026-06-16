<script setup lang="ts">
import { computed, ref } from 'vue';

import { generateStorageStrategy } from '@/api/trading';

import StorageParameterForm from './components/StorageParameterForm.vue';
import StoragePriceForecastChart from './components/StoragePriceForecastChart.vue';
import StorageProfitPanel from './components/StorageProfitPanel.vue';
import StorageStrategyChart from './components/StorageStrategyChart.vue';
import StorageStrategyList from './components/StorageStrategyList.vue';
import StorageStrategyResult from './components/StorageStrategyResult.vue';
import {
  defaultStorageStrategyRequest,
  defaultStorageStrategyResult,
  getSpotBidPoints,
  storageStrategyDrafts,
} from './trading.mock';
import type { StorageStrategyRequest, StorageStrategyResponse, TradingPointMode } from './trading.types';

const pointMode = ref<TradingPointMode>('24');
const loading = ref(false);
const errorMessage = ref('');
const strategyResult = ref<StorageStrategyResponse>(defaultStorageStrategyResult);
const strategyRequest = ref<StorageStrategyRequest>({
  ...defaultStorageStrategyRequest,
  charge_price_signal: [...defaultStorageStrategyRequest.charge_price_signal],
  discharge_price_signal: [...defaultStorageStrategyRequest.discharge_price_signal],
});

const currentPoints = computed(() => getSpotBidPoints(pointMode.value));
const strategyPoints = computed(() => getSpotBidPoints('96'));
const stepItems = [
  { index: 1, title: '填写参数', status: 'done' },
  { index: 2, title: '充放电策略', status: 'active' },
  { index: 3, title: '策略收益测算', status: 'pending' },
];

async function handleGenerateStrategy() {
  loading.value = true;
  errorMessage.value = '';
  try {
    strategyResult.value = await generateStorageStrategy(strategyRequest.value);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '策略生成失败';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="spot-storage-page">
    <header class="spot-storage-page__title">
      <div>
        <p>Spot Bid</p>
        <h2>现货交易申报</h2>
        <span>独立储能日前策略</span>
      </div>
      <div class="spot-storage-page__actions">
        <button :class="{ active: pointMode === '24' }" type="button" @click="pointMode = '24'">24点</button>
        <button :class="{ active: pointMode === '96' }" type="button" @click="pointMode = '96'">96点</button>
        <button type="button" disabled>重新计算</button>
      </div>
    </header>

    <div class="spot-storage-page__top-grid">
      <div data-test="storage-price-chart">
        <StoragePriceForecastChart :points="currentPoints" />
      </div>
      <StorageStrategyList :drafts="storageStrategyDrafts" />
    </div>

    <section class="dashboard-card storage-stepper" data-test="storage-stepper">
      <strong>策略信息</strong>
      <div v-for="step in stepItems" :key="step.index" :class="['storage-stepper__item', `is-${step.status}`]">
        <span>{{ step.index }}</span>
        <p>{{ step.title }}</p>
      </div>
    </section>

    <StorageParameterForm :model="strategyRequest" :loading="loading" @generate="handleGenerateStrategy" />

    <div data-test="storage-strategy-chart">
      <StorageStrategyChart :points="strategyPoints" :result="strategyResult" />
    </div>

    <StorageStrategyResult :result="strategyResult" :error="errorMessage" />
    <StorageProfitPanel :result="strategyResult" />
  </section>
</template>

<style scoped>
.spot-storage-page {
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

.spot-storage-page__title {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
}

.spot-storage-page__title p,
.spot-storage-page__title span {
  margin: 0;
  color: var(--color-muted);
  font-size: 12px;
}

.spot-storage-page__title h2 {
  margin: 4px 0;
  color: #ffffff;
  font-size: 24px;
}

.spot-storage-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.spot-storage-page__actions button {
  border: 1px solid rgba(143, 155, 186, 0.24);
  border-radius: 4px;
  padding: 8px 12px;
  color: var(--color-muted);
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
}

.spot-storage-page__actions button.active {
  border-color: rgba(0, 242, 254, 0.45);
  color: var(--color-primary);
  box-shadow: var(--shadow-glow);
}

.spot-storage-page__actions button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.spot-storage-page__top-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 16px;
}

.storage-stepper {
  display: grid;
  grid-template-columns: 160px repeat(3, minmax(0, 1fr));
  align-items: center;
  gap: 16px;
}

.storage-stepper > strong {
  color: #ffffff;
}

.storage-stepper__item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-muted);
}

.storage-stepper__item span {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border: 1px solid rgba(143, 155, 186, 0.36);
  border-radius: 50%;
}

.storage-stepper__item p {
  margin: 0;
}

.storage-stepper__item.is-done span,
.storage-stepper__item.is-active span {
  border-color: rgba(0, 242, 254, 0.5);
  color: var(--color-primary);
  box-shadow: var(--shadow-glow);
}

@media (max-width: 1180px) {
  .spot-storage-page__top-grid,
  .storage-stepper {
    grid-template-columns: 1fr;
  }
}
</style>
