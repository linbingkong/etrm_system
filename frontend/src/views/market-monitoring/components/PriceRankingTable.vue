<script setup lang="ts">
import type { PriceRankingItem } from '../market-monitoring.types';

defineProps<{
  rows: PriceRankingItem[];
}>();
</script>

<template>
  <section class="dashboard-card price-ranking">
    <div class="dashboard-card__header">
      <h3>市场价格排名</h3>
      <span>均价 / 价差</span>
    </div>
    <table>
      <thead>
        <tr>
          <th>排名</th>
          <th>主体</th>
          <th>区域</th>
          <th>均价</th>
          <th>价差</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.rank" :class="[`is-${row.status}`]">
          <td>{{ row.rank }}</td>
          <td>{{ row.name }}</td>
          <td>{{ row.area }}</td>
          <td>{{ row.averagePrice }}</td>
          <td>{{ row.spread }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.price-ranking table {
  width: 100%;
  border-collapse: collapse;
  color: #ffffff;
  font-size: 13px;
}

.price-ranking th {
  padding: 10px;
  background: #172554;
  color: #ffffff;
  text-align: left;
}

.price-ranking td {
  padding: 10px;
  border-bottom: 1px solid rgba(143, 155, 186, 0.12);
  color: var(--color-muted);
}

.price-ranking tr.is-danger td {
  color: var(--color-danger);
}

.price-ranking tr.is-warning td {
  color: var(--color-warning);
}
</style>
