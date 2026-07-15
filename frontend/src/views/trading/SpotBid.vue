<script setup lang="ts">
import { computed, ref } from 'vue';

import { createStrategy, updateStrategy } from '@/api/strategies';
import { generateStorageStrategy } from '@/api/trading';

import StorageParameterForm from './components/StorageParameterForm.vue';
import StoragePriceForecastChart from './components/StoragePriceForecastChart.vue';
import StorageProfitPanel from './components/StorageProfitPanel.vue';
import StorageStrategyChart from './components/StorageStrategyChart.vue';
import StorageStrategyList from './components/StorageStrategyList.vue';
import StorageStrategyResult from './components/StorageStrategyResult.vue';
import { defaultStorageStrategyRequest, defaultStorageStrategyResult, getSpotBidPoints } from './trading.mock';
import type {
  StorageSavedStrategy,
  StorageStrategyRequest,
  StorageStrategyResponse,
  StorageStrategyStage,
  TradingPointMode,
} from './trading.types';

const pointMode = ref<TradingPointMode>('24');
const loading = ref(false);
const saving = ref(false);
const errorMessage = ref('');
const stage = ref<StorageStrategyStage>('parameters');
const strategyName = ref('策略1');
const selectedStrategyId = ref('');
const savedStrategies = ref<StorageSavedStrategy[]>([]);
const strategyResult = ref<StorageStrategyResponse>(cloneResult(defaultStorageStrategyResult));
const strategyRequest = ref<StorageStrategyRequest>(cloneRequest(defaultStorageStrategyRequest));

const currentPoints = computed(() => getSpotBidPoints(pointMode.value));
const strategyPoints = computed(() => getSpotBidPoints('96'));
const hasGeneratedStrategy = computed(() => stage.value === 'strategy' || stage.value === 'profit');
const hasProfitAnalysis = computed(() => stage.value === 'profit');
const stepItems = computed(() => [
  { index: 1, title: '填写参数', status: stage.value === 'parameters' ? 'active' : 'done' },
  { index: 2, title: '充放电策略', status: stage.value === 'parameters' ? 'pending' : stage.value === 'strategy' ? 'active' : 'done' },
  { index: 3, title: '策略收益测算', status: stage.value === 'profit' ? 'active' : 'pending' },
]);

async function handleGenerateStrategy() {
  loading.value = true;
  errorMessage.value = '';
  try {
    strategyResult.value = await generateStorageStrategy(strategyRequest.value);
    stage.value = 'strategy';
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '策略生成失败';
  } finally {
    loading.value = false;
  }
}

function handleCalculateProfit() {
  if (hasGeneratedStrategy.value) {
    stage.value = 'profit';
  }
}

async function handleSaveStrategy() {
  if (!hasGeneratedStrategy.value) return;

  saving.value = true;
  try {
    const payload = {
      name: strategyName.value.trim() || '未命名策略',
      strategy_type: 'storage',
      market: 'day_ahead',
      status: stage.value === 'profit' ? 'active' : 'draft',
      expected_profit_yuan: Number(strategyResult.value.submission_packet?.daily_params?.expected_profit_yuan ?? 0),
      risk_level: strategyResult.value.validation_passed ? 'low' : 'high',
      payload: {
        request: cloneRequest(strategyRequest.value),
        result: cloneResult(strategyResult.value),
        stage: stage.value,
      },
    } as const;
    const existingId = selectedStrategyId.value;
    const optimisticId = existingId || `strategy-${Date.now()}`;
    const optimisticSnapshot: StorageSavedStrategy = {
      id: optimisticId,
      name: payload.name,
      status: 'generated',
      updatedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      request: cloneRequest(strategyRequest.value),
      result: cloneResult(strategyResult.value),
      stage: stage.value,
    };
    const index = savedStrategies.value.findIndex((item) => item.id === optimisticId);
    if (index >= 0) {
      savedStrategies.value[index] = optimisticSnapshot;
    } else {
      savedStrategies.value.push(optimisticSnapshot);
    }
    selectedStrategyId.value = optimisticId;

    const saved = existingId
      ? await updateStrategy(existingId, payload)
      : await createStrategy(payload);
    const savedId = saved.id ?? optimisticId;
    const savedIndex = savedStrategies.value.findIndex((item) => item.id === optimisticId);
    if (savedIndex >= 0) {
      savedStrategies.value[savedIndex] = {
        ...optimisticSnapshot,
        id: savedId,
        name: saved.name ?? optimisticSnapshot.name,
        updatedAt: saved.updated_at?.slice(11, 16) ?? optimisticSnapshot.updatedAt,
      };
    }
    selectedStrategyId.value = savedId;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '策略保存失败';
  } finally {
    saving.value = false;
  }
}

function handleSelectStrategy(id: string) {
  const strategy = savedStrategies.value.find((item) => item.id === id);
  if (!strategy) return;

  selectedStrategyId.value = strategy.id;
  strategyName.value = strategy.name;
  strategyRequest.value = cloneRequest(strategy.request);
  strategyResult.value = cloneResult(strategy.result);
  stage.value = strategy.stage;
}

function cloneRequest(request: StorageStrategyRequest): StorageStrategyRequest {
  return JSON.parse(JSON.stringify(request)) as StorageStrategyRequest;
}

function cloneResult(result: StorageStrategyResponse): StorageStrategyResponse {
  return JSON.parse(JSON.stringify(result)) as StorageStrategyResponse;
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
      <StorageStrategyList :strategies="savedStrategies" :selected-id="selectedStrategyId" @select="handleSelectStrategy" />
    </div>

    <section class="dashboard-card storage-stepper" data-test="storage-stepper">
      <strong>策略信息</strong>
      <div v-for="step in stepItems" :key="step.index" :class="['storage-stepper__item', `is-${step.status}`]">
        <span>{{ step.index }}</span>
        <p>{{ step.title }}</p>
      </div>
    </section>

    <StorageParameterForm v-model:strategy-name="strategyName" :model="strategyRequest" :loading="loading" @generate="handleGenerateStrategy" />

    <div v-if="hasGeneratedStrategy" data-test="storage-strategy-chart">
      <StorageStrategyChart :points="strategyPoints" :result="strategyResult" />
    </div>

    <StorageStrategyResult v-if="hasGeneratedStrategy" :result="strategyResult" :error="errorMessage" @calculate-profit="handleCalculateProfit" />
    <StorageProfitPanel v-if="hasProfitAnalysis" :result="strategyResult" />

    <footer class="spot-storage-page__footer" data-test="spot-storage-page-footer">
      <button data-test="save-storage-strategy" type="button" :disabled="!hasGeneratedStrategy || saving" @click="handleSaveStrategy">
        保存策略
      </button>
    </footer>
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

.spot-storage-page__actions button.active,
.spot-storage-page__actions button:not(:disabled):hover {
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

.spot-storage-page__footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid rgba(143, 155, 186, 0.14);
  padding-top: 16px;
}

.spot-storage-page__footer button {
  min-width: 128px;
  border: 1px solid rgba(0, 242, 254, 0.42);
  border-radius: 6px;
  padding: 10px 18px;
  color: var(--color-primary);
  background: rgba(0, 242, 254, 0.08);
  cursor: pointer;
}

.spot-storage-page__footer button:hover:not(:disabled) {
  border-color: rgba(0, 242, 254, 0.7);
  background: rgba(0, 242, 254, 0.14);
  box-shadow: 0 0 18px rgba(0, 242, 254, 0.14);
}

.spot-storage-page__footer button:disabled {
  cursor: not-allowed;
  opacity: 0.42;
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
