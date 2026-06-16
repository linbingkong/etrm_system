<script setup lang="ts">
import type { TradingSession } from '../trading.types';

defineProps<{
  session: TradingSession;
}>();
</script>

<template>
  <section class="dashboard-card trading-filter" data-test="trading-filter-bar">
    <div><span>交易日</span><strong>{{ session.tradeDate }}</strong></div>
    <div><span>市场类型</span><strong>{{ session.marketType === 'dayAhead' ? '日前市场' : '实时市场' }}</strong></div>
    <div><span>交易轮次</span><strong>{{ session.roundName }}</strong></div>
    <div><span>窗口状态</span><strong>{{ session.windowStatus === 'closing' ? '即将关闭' : session.windowStatus }}</strong></div>
    <div v-if="session.pointMode"><span>点数模式</span><strong>{{ session.pointMode }}点</strong></div>
    <div><span>更新时间</span><strong>{{ session.updatedAt }}</strong></div>
  </section>
</template>

<style scoped>
.trading-filter {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
}

.trading-filter div {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.trading-filter span {
  color: var(--color-muted);
  font-size: 12px;
}

.trading-filter strong {
  overflow: hidden;
  color: #ffffff;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 1180px) {
  .trading-filter {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .trading-filter {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
