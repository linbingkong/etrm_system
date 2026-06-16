<script setup lang="ts">
import type { TradingProgressStep } from '../trading.types';

defineProps<{
  steps: TradingProgressStep[];
}>();
</script>

<template>
  <section class="dashboard-card trading-progress" data-test="trading-progress-panel">
    <div class="dashboard-card__header">
      <h3>交易流程进度</h3>
      <span>市场监测 → 申报 → 曲线 → 结算</span>
    </div>
    <div class="trading-progress__steps">
      <article v-for="step in steps" :key="step.key" :class="[`is-${step.status}`]">
        <strong>{{ step.title }}</strong>
        <span>{{ step.description }}</span>
      </article>
    </div>
  </section>
</template>

<style scoped>
.trading-progress__steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.trading-progress article {
  min-height: 92px;
  padding: 12px;
  border: 1px solid rgba(0, 242, 254, 0.12);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.03);
}

.trading-progress article.is-active {
  border-color: rgba(0, 242, 254, 0.5);
  box-shadow: var(--shadow-glow);
}

.trading-progress strong,
.trading-progress span {
  display: block;
}

.trading-progress strong {
  color: #ffffff;
  font-size: 14px;
}

.trading-progress span {
  margin-top: 8px;
  color: var(--color-muted);
  font-size: 12px;
}

@media (max-width: 900px) {
  .trading-progress__steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
