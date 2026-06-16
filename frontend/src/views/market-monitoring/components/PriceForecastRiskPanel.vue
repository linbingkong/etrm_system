<script setup lang="ts">
import type { PriceForecastRisk } from '../market-monitoring.types';

defineProps<{
  risks: PriceForecastRisk[];
}>();
</script>

<template>
  <section class="dashboard-card forecast-risk" data-test="price-forecast-risk">
    <div class="dashboard-card__header">
      <h3>风险时段提示</h3>
      <span>高价风险 / 低价机会 / 偏差异常</span>
    </div>
    <div class="forecast-risk__list">
      <article v-for="risk in risks" :key="risk.id" :class="[`is-${risk.level}`]">
        <div>
          <strong>{{ risk.title }}</strong>
          <span>{{ risk.timeRange }}</span>
        </div>
        <p>{{ risk.description }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.forecast-risk__list {
  display: grid;
  gap: 12px;
}

.forecast-risk article {
  border: 1px solid rgba(0, 242, 254, 0.12);
  border-radius: 4px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
}

.forecast-risk article.is-high {
  border-color: rgba(255, 56, 96, 0.36);
}

.forecast-risk article.is-medium {
  border-color: rgba(255, 179, 0, 0.36);
}

.forecast-risk div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.forecast-risk strong {
  color: #ffffff;
  font-size: 14px;
}

.forecast-risk span,
.forecast-risk p {
  color: var(--color-muted);
  font-size: 12px;
}

.forecast-risk p {
  margin: 8px 0 0;
  line-height: 1.6;
}
</style>
