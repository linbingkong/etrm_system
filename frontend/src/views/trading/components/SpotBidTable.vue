<script setup lang="ts">
import type { SpotBidPoint } from '../trading.types';

defineProps<{
  rows: SpotBidPoint[];
}>();
</script>

<template>
  <section class="dashboard-card trading-table" data-test="spot-bid-table">
    <div class="dashboard-card__header">
      <h3>量价申报表</h3>
      <span>{{ rows.length }} 点</span>
    </div>
    <table>
      <thead>
        <tr>
          <th>时段</th>
          <th>预测负荷</th>
          <th>申报电量</th>
          <th>申报价格</th>
          <th>参考价格</th>
          <th>状态</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.time" :class="[`is-${row.status}`]">
          <td>{{ row.time }}</td>
          <td>{{ row.forecastLoad }}</td>
          <td>{{ row.bidVolume }}</td>
          <td>{{ row.bidPrice }}</td>
          <td>{{ row.referencePrice }}</td>
          <td>{{ row.status === 'rejected' ? '越限' : row.status === 'validating' ? '预警' : '草稿' }}</td>
          <td>{{ row.remark }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.trading-table {
  overflow-x: auto;
}

.trading-table table {
  width: 100%;
  min-width: 820px;
  border-collapse: collapse;
  font-size: 13px;
}

.trading-table th {
  padding: 10px;
  background: #172554;
  color: #ffffff;
  text-align: left;
}

.trading-table td {
  padding: 10px;
  border-bottom: 1px solid rgba(143, 155, 186, 0.12);
  color: var(--color-muted);
}

.trading-table tr.is-rejected td {
  color: var(--color-danger);
}

.trading-table tr.is-validating td {
  color: var(--color-warning);
}
</style>
