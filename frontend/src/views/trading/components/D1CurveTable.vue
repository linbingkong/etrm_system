<script setup lang="ts">
import type { D1CurvePoint } from '../trading.types';

defineProps<{
  rows: D1CurvePoint[];
}>();
</script>

<template>
  <section class="dashboard-card trading-table" data-test="d1-curve-table">
    <div class="dashboard-card__header">
      <h3>曲线明细</h3>
      <span>{{ rows.length }} 点</span>
    </div>
    <table>
      <thead>
        <tr>
          <th>时段</th>
          <th>计划电量</th>
          <th>申报电量</th>
          <th>预测负荷</th>
          <th>偏差</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.time" :class="[`is-${row.status}`]">
          <td>{{ row.time }}</td>
          <td>{{ row.planPower }}</td>
          <td>{{ row.declaredPower }}</td>
          <td>{{ row.forecastLoad }}</td>
          <td>{{ row.deviation }}</td>
          <td>{{ row.status === 'danger' ? '越限' : row.status === 'warning' ? '预警' : '正常' }}</td>
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
  min-width: 720px;
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

.trading-table tr.is-danger td {
  color: var(--color-danger);
}

.trading-table tr.is-warning td {
  color: var(--color-warning);
}
</style>
