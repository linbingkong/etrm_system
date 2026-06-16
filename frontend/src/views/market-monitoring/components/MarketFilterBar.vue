<script setup lang="ts">
import type { MarketFilter } from '../market-monitoring.types';

defineProps<{
  filter: MarketFilter;
}>();
</script>

<template>
  <section class="dashboard-card market-filter" data-test="market-filter-bar">
    <div>
      <span>交易日</span>
      <strong>{{ filter.tradeDate }}</strong>
    </div>
    <div>
      <span>市场类型</span>
      <strong>{{ filter.marketType === 'spot' ? '现货市场' : filter.marketType }}</strong>
    </div>
    <div>
      <span>时段粒度</span>
      <strong>{{ filter.interval }}</strong>
    </div>
    <div>
      <span>区域</span>
      <strong>{{ filter.area }}</strong>
    </div>
    <div>
      <span>自动刷新</span>
      <strong>{{ filter.autoRefresh ? '开启' : '关闭' }}</strong>
    </div>
    <div>
      <span>更新时间</span>
      <strong>{{ filter.updatedAt }}</strong>
    </div>
  </section>
</template>

<style scoped>
.market-filter {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
}

.market-filter div {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.market-filter span {
  color: var(--color-muted);
  font-size: 12px;
}

.market-filter strong {
  overflow: hidden;
  color: #ffffff;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 1180px) {
  .market-filter {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .market-filter {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
