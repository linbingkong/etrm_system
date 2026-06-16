<script setup lang="ts">
import type { MarketKpi } from '../market-monitoring.types';

defineProps<{
  items: MarketKpi[];
}>();
</script>

<template>
  <section class="market-kpi-grid">
    <article v-for="item in items" :key="item.key" :class="['dashboard-card', 'market-kpi', `is-${item.status}`]" data-test="market-kpi-card">
      <p>{{ item.title }}</p>
      <div>
        <span class="dashboard-number">{{ item.value }}</span>
        <small v-if="item.unit">{{ item.unit }}</small>
      </div>
      <em>{{ item.compareText }}</em>
    </article>
  </section>
</template>

<style scoped>
.market-kpi-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
}

.market-kpi {
  min-height: 116px;
}

.market-kpi.is-warning,
.market-kpi.is-danger {
  box-shadow: var(--shadow-glow);
}

.market-kpi p {
  margin: 0 0 12px;
  color: var(--color-muted);
  font-size: 13px;
}

.market-kpi div {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.market-kpi small,
.market-kpi em {
  color: var(--color-muted);
  font-size: 12px;
  font-style: normal;
}

.market-kpi em {
  display: block;
  margin-top: 12px;
}

.market-kpi.is-danger em {
  color: var(--color-danger);
}

.market-kpi.is-warning em {
  color: var(--color-warning);
}

@media (max-width: 1280px) {
  .market-kpi-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .market-kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
