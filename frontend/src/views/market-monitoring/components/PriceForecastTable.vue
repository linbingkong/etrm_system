<script setup lang="ts">
import type { PriceForecastPoint } from '../market-monitoring.types';

defineProps<{
  rows: PriceForecastPoint[];
}>();
</script>

<template>
  <section class="dashboard-card forecast-table" data-test="price-forecast-table">
    <div class="dashboard-card__header">
      <h3>时段明细</h3>
      <span>预测价 / 实际价 / 偏差 / 置信区间 / 风险等级</span>
    </div>
    <table>
      <thead>
        <tr>
          <th>时段</th>
          <th>预测价</th>
          <th>实际价</th>
          <th>偏差</th>
          <th>置信区间</th>
          <th>风险等级</th>
          <th>交易提示</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.time" :class="[`is-${row.riskLevel}`]">
          <td>{{ row.time }}</td>
          <td>{{ row.forecastPrice }}</td>
          <td>{{ row.actualPrice ?? '-' }}</td>
          <td>{{ row.deviation ?? '-' }}</td>
          <td>{{ row.confidenceLow }} - {{ row.confidenceHigh }}</td>
          <td>{{ row.riskLevel === 'high' ? '高' : row.riskLevel === 'medium' ? '中' : '低' }}</td>
          <td>{{ row.suggestion }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.forecast-table {
  overflow-x: auto;
}

.forecast-table table {
  width: 100%;
  min-width: 860px;
  border-collapse: collapse;
  color: #ffffff;
  font-size: 13px;
}

.forecast-table th {
  padding: 10px;
  background: #172554;
  color: #ffffff;
  text-align: left;
}

.forecast-table td {
  padding: 10px;
  border-bottom: 1px solid rgba(143, 155, 186, 0.12);
  color: var(--color-muted);
}

.forecast-table tr:hover td {
  background: rgba(0, 242, 254, 0.08);
}

.forecast-table tr.is-high td {
  color: var(--color-danger);
}

.forecast-table tr.is-medium td {
  color: var(--color-warning);
}
</style>
