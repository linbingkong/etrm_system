<script setup lang="ts">
import type { TradingRisk } from '../trading.types';

defineProps<{
  risks: TradingRisk[];
}>();
</script>

<template>
  <section class="dashboard-card trading-risk" data-test="trading-risk-panel">
    <div class="dashboard-card__header">
      <h3>风险提醒</h3>
      <span>{{ risks.length }} 项</span>
    </div>
    <component :is="risk.path ? 'router-link' : 'article'" v-for="risk in risks" :key="risk.id" :to="risk.path" :class="['trading-risk__item', `is-${risk.level}`]">
      <strong>{{ risk.title }}</strong>
      <span>{{ risk.source }} · {{ risk.time }}</span>
    </component>
  </section>
</template>

<style scoped>
.trading-risk {
  display: grid;
  gap: 12px;
  align-content: start;
}

.trading-risk__item {
  display: grid;
  gap: 6px;
  padding: 12px;
  border-left: 3px solid var(--color-primary);
  border-radius: 4px;
  color: inherit;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.03);
}

.trading-risk__item.is-high {
  border-left-color: var(--color-danger);
}

.trading-risk__item.is-medium {
  border-left-color: var(--color-warning);
}

.trading-risk strong {
  color: #ffffff;
  font-size: 14px;
}

.trading-risk span {
  color: var(--color-muted);
  font-size: 12px;
}
</style>
