<script setup lang="ts">
import type { PriceSummaryItem } from '../market-monitoring.types';

defineProps<{
  items: PriceSummaryItem[];
}>();
</script>

<template>
  <section class="dashboard-card price-summary" data-test="price-summary">
    <div v-for="item in items" :key="item.key" :class="[`is-${item.status}`]">
      <span>{{ item.title }}</span>
      <strong class="dashboard-number">{{ item.value }}</strong>
      <small>{{ item.unit }}</small>
    </div>
  </section>
</template>

<style scoped>
.price-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.price-summary div {
  min-width: 0;
  padding: 12px;
  border: 1px solid rgba(0, 242, 254, 0.1);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.03);
}

.price-summary span,
.price-summary small {
  display: block;
  color: var(--color-muted);
  font-size: 12px;
}

.price-summary strong {
  display: block;
  margin: 8px 0 6px;
  font-size: 24px;
}

.price-summary .is-danger strong {
  color: var(--color-danger);
}

.price-summary .is-warning strong {
  color: var(--color-warning);
}

@media (max-width: 900px) {
  .price-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
