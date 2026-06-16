<script setup lang="ts">
import type { BusinessDataItem } from '../dashboard.types';

defineProps<{
  items: BusinessDataItem[];
}>();
</script>

<template>
  <section class="dashboard-card business-data">
    <div class="dashboard-card__header">
      <h3>业务数据</h3>
      <span>今日概览</span>
    </div>
    <div class="business-data__grid">
      <div v-for="item in items" :key="item.title" :class="['business-data__item', `is-${item.status}`]">
        <span>{{ item.title }}</span>
        <strong class="dashboard-number">{{ item.value }}</strong>
        <small>{{ item.description }}</small>
      </div>
    </div>
  </section>
</template>

<style scoped>
.business-data__grid {
  display: grid;
  gap: 10px;
}

.business-data__item {
  padding: 10px 12px;
  border: 1px solid rgba(0, 242, 254, 0.1);
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.025);
}

.business-data__item span,
.business-data__item small {
  display: block;
  color: var(--color-muted);
  font-size: 12px;
}

.business-data__item strong {
  display: block;
  margin: 6px 0;
  color: #ffffff;
}

.business-data__item.is-danger strong {
  color: var(--color-danger);
}

.business-data__item.is-warning strong {
  color: var(--color-warning);
}

.business-data__item.is-success strong {
  color: var(--color-success);
}
</style>
