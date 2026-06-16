<script setup lang="ts">
import type { SupplyDemandItem } from '../market-monitoring.types';

defineProps<{
  items: SupplyDemandItem[];
}>();
</script>

<template>
  <section class="dashboard-card supply-panel" data-test="supply-demand-panel">
    <div class="dashboard-card__header">
      <h3>供需概览</h3>
      <span>实时估算</span>
    </div>
    <div class="supply-panel__grid">
      <component :is="item.path ? 'router-link' : 'div'" v-for="item in items" :key="item.key" :class="[`is-${item.status}`]" :to="item.path">
        <span>{{ item.title }}</span>
        <strong class="dashboard-number">{{ item.value }}</strong>
        <small>{{ item.unit }}</small>
      </component>
    </div>
  </section>
</template>

<style scoped>
.supply-panel__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.supply-panel__grid div,
.supply-panel__grid a {
  min-height: 92px;
  padding: 12px;
  border: 1px solid rgba(0, 242, 254, 0.1);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.03);
  color: inherit;
  text-decoration: none;
}

.supply-panel span,
.supply-panel small {
  display: block;
  color: var(--color-muted);
  font-size: 12px;
}

.supply-panel strong {
  display: block;
  margin: 10px 0 6px;
  font-size: 24px;
}

.supply-panel .is-warning strong {
  color: var(--color-warning);
}
</style>
