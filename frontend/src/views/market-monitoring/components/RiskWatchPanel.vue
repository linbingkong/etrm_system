<script setup lang="ts">
import type { MarketRiskEvent } from '../market-monitoring.types';

defineProps<{
  risks: MarketRiskEvent[];
}>();

const levelText = {
  high: '高风险',
  medium: '中风险',
  low: '提醒',
};
</script>

<template>
  <section class="dashboard-card risk-panel" data-test="risk-watch-panel">
    <div class="dashboard-card__header">
      <h3>风险观察</h3>
      <span>{{ risks.length }} 项</span>
    </div>
    <component :is="risk.path ? 'router-link' : 'article'" v-for="risk in risks" :key="risk.id" :to="risk.path" :class="['risk-panel__item', `is-${risk.level}`]">
      <div>
        <strong>{{ risk.title }}</strong>
        <span>{{ levelText[risk.level] }} · {{ risk.source }} · {{ risk.time }}</span>
      </div>
      <p>{{ risk.description }}</p>
    </component>
  </section>
</template>

<style scoped>
.risk-panel {
  display: grid;
  gap: 12px;
  align-content: start;
}

.risk-panel__item {
  display: block;
  padding: 12px;
  border-left: 3px solid var(--color-primary);
  border-radius: 4px;
  color: inherit;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.03);
}

.risk-panel__item.is-high {
  border-left-color: var(--color-danger);
}

.risk-panel__item.is-medium {
  border-left-color: var(--color-warning);
}

.risk-panel__item strong {
  display: block;
  color: #ffffff;
  font-size: 14px;
}

.risk-panel__item span,
.risk-panel__item p {
  color: var(--color-muted);
  font-size: 12px;
}

.risk-panel__item p {
  margin: 8px 0 0;
  line-height: 1.6;
}
</style>
