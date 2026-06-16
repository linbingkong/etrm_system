<script setup lang="ts">
import { computed } from 'vue';

import type { StorageStrategyResponse } from '../trading.types';

const props = defineProps<{ result: StorageStrategyResponse }>();

const items = computed(() => {
  const params = props.result.submission_packet.daily_params ?? {};
  return [
    { label: '预期收入', value: params.expected_revenue_yuan },
    { label: '充电成本', value: params.expected_charge_cost_yuan },
    { label: '退化成本', value: params.expected_degradation_cost_yuan },
    { label: '可变费用', value: params.expected_variable_fee_yuan },
    { label: '风险成本', value: params.expected_risk_cost_yuan },
    { label: '预期收益', value: params.expected_profit_yuan },
  ];
});
</script>

<template>
  <section class="dashboard-card profit-panel" data-test="storage-profit-panel">
    <div class="dashboard-card__header">
      <h3>策略收益测算</h3>
      <span>元 / 日</span>
    </div>
    <div class="profit-panel__grid">
      <article v-for="item in items" :key="item.label">
        <span>{{ item.label }}</span>
        <strong class="dashboard-number">{{ Number(item.value ?? 0).toFixed(2) }}</strong>
      </article>
    </div>
  </section>
</template>

<style scoped>
.profit-panel__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.profit-panel article {
  border: 1px solid rgba(0, 242, 254, 0.12);
  border-radius: 4px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
}

.profit-panel span {
  color: var(--color-muted);
  font-size: 12px;
}

.profit-panel strong {
  display: block;
  margin-top: 8px;
  color: var(--color-primary);
  font-size: 20px;
}
</style>
