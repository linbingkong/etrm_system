<script setup lang="ts">
import type { TradingKpi } from '../trading.types';

defineProps<{
  items: TradingKpi[];
}>();
</script>

<template>
  <section class="trading-kpi-grid">
    <article v-for="item in items" :key="item.key" :class="['dashboard-card', 'trading-kpi', `is-${item.status}`]" data-test="trading-kpi-card">
      <p>{{ item.title }}</p>
      <div><strong class="dashboard-number">{{ item.value }}</strong><small v-if="item.unit">{{ item.unit }}</small></div>
      <span>{{ item.description }}</span>
    </article>
  </section>
</template>

<style scoped>
.trading-kpi-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
}

.trading-kpi {
  min-height: 116px;
}

.trading-kpi p,
.trading-kpi span,
.trading-kpi small {
  margin: 0;
  color: var(--color-muted);
  font-size: 12px;
}

.trading-kpi div {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin: 12px 0;
}

.trading-kpi.is-danger span {
  color: var(--color-danger);
}

.trading-kpi.is-warning span {
  color: var(--color-warning);
}

@media (max-width: 1280px) {
  .trading-kpi-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
