<script setup lang="ts">
import type { KpiItem } from '../dashboard.types';

defineProps<{
  items: KpiItem[];
}>();
</script>

<template>
  <section class="kpi-grid">
    <article v-for="item in items" :key="item.key" :class="['dashboard-card', 'kpi-card', `is-${item.status}`]" data-test="kpi-card">
      <p class="kpi-card__title">{{ item.title }}</p>
      <div class="kpi-card__value">
        <span class="dashboard-number">{{ item.value }}</span>
        <small v-if="item.unit">{{ item.unit }}</small>
      </div>
      <p :class="['kpi-card__trend', `is-${item.trend}`]">{{ item.trendText }}</p>
    </article>
  </section>
</template>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.kpi-card {
  min-height: 118px;
}

.kpi-card.is-danger,
.kpi-card.is-warning {
  box-shadow: var(--shadow-glow);
}

.kpi-card__title {
  margin: 0 0 12px;
  color: var(--color-muted);
  font-size: 13px;
}

.kpi-card__value {
  display: flex;
  align-items: baseline;
  gap: 6px;
  color: #ffffff;
}

.kpi-card__value small {
  color: var(--color-muted);
}

.kpi-card__trend {
  margin: 12px 0 0;
  font-size: 12px;
}

.kpi-card__trend.is-up {
  color: var(--color-danger);
}

.kpi-card__trend.is-down {
  color: var(--color-success);
}

.kpi-card__trend.is-flat {
  color: var(--color-warning);
}

@media (max-width: 1200px) {
  .kpi-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
