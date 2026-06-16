<script setup lang="ts">
import type { PriceDetailRow } from '../market-monitoring.types';

defineProps<{
  rows: PriceDetailRow[];
  state?: 'ready' | 'loading' | 'error' | 'forbidden';
}>();
</script>

<template>
  <section class="dashboard-card price-detail" data-test="price-detail-table">
    <div class="dashboard-card__header">
      <h3>时段明细</h3>
      <span>价格 / 电量 / 价差</span>
    </div>
    <div v-if="state === 'loading'" class="price-detail__empty">行情数据加载中...</div>
    <div v-else-if="state === 'error'" class="price-detail__empty">行情数据获取失败，请稍后重试</div>
    <div v-else-if="state === 'forbidden'" class="price-detail__empty">当前账号无权限查看明细数据</div>
    <div v-else-if="rows.length === 0" class="price-detail__empty">当前筛选条件下暂无行情数据</div>
    <table v-else>
      <thead>
        <tr>
          <th>时段</th>
          <th>日前价格</th>
          <th>实时价格</th>
          <th>电量</th>
          <th>价差</th>
          <th>状态</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.time" :class="[`is-${row.status}`]">
          <td>{{ row.time }}</td>
          <td>{{ row.dayAheadPrice }}</td>
          <td>{{ row.realtimePrice }}</td>
          <td>{{ row.volume }}</td>
          <td>{{ row.spread }}</td>
          <td>{{ row.status === 'danger' ? '越限' : row.status === 'warning' ? '预警' : '正常' }}</td>
          <td>{{ row.remark }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.price-detail {
  overflow-x: auto;
}

.price-detail table {
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
  color: #ffffff;
  font-size: 13px;
}

.price-detail th {
  padding: 10px;
  background: #172554;
  color: #ffffff;
  text-align: left;
}

.price-detail td {
  padding: 10px;
  border-bottom: 1px solid rgba(143, 155, 186, 0.12);
  color: var(--color-muted);
}

.price-detail tr:hover td {
  background: rgba(0, 242, 254, 0.08);
}

.price-detail tr.is-danger td {
  color: var(--color-danger);
}

.price-detail tr.is-warning td {
  color: var(--color-warning);
}

.price-detail__empty {
  padding: 24px;
  color: var(--color-muted);
  text-align: center;
}
</style>
