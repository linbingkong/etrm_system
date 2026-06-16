<script setup lang="ts">
import D1CurveChart from './components/D1CurveChart.vue';
import D1CurveTable from './components/D1CurveTable.vue';
import TradingFilterBar from './components/TradingFilterBar.vue';
import ValidationPanel from './components/ValidationPanel.vue';
import { d1CurvePoints, d1ValidationItems, tradingSession } from './trading.mock';
</script>

<template>
  <section class="trading-page">
    <header class="trading-page__title">
      <div>
        <p>D1 Curve</p>
        <h2>D1 曲线申报</h2>
      </div>
      <span>计划 / 申报 / 偏差</span>
    </header>

    <TradingFilterBar :session="{ ...tradingSession, roundName: 'D1 曲线申报', pointMode: '96' }" />
    <div class="trading-page__main-grid">
      <D1CurveChart :points="d1CurvePoints" />
      <ValidationPanel :items="d1ValidationItems" />
    </div>
    <D1CurveTable :rows="d1CurvePoints" />
    <footer class="dashboard-card trading-actions">
      <button type="button">保存草稿</button>
      <button type="button">校验</button>
      <button type="button" disabled title="校验通过后可提交">提交</button>
    </footer>
  </section>
</template>

<style scoped>
.trading-page {
  display: grid;
  min-height: calc(100vh - 96px);
  gap: 16px;
  padding: 4px;
  color: #ffffff;
  background:
    linear-gradient(rgba(0, 242, 254, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 242, 254, 0.04) 1px, transparent 1px),
    var(--theme-bg);
  background-size: 28px 28px;
}

.trading-page__title {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
}

.trading-page__title p,
.trading-page__title span {
  margin: 0;
  color: var(--color-muted);
  font-size: 12px;
}

.trading-page__title h2 {
  margin: 4px 0 0;
  font-size: 24px;
}

.trading-page__main-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(320px, 1fr);
  gap: 16px;
}

.trading-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.trading-actions button {
  border: 1px solid rgba(143, 155, 186, 0.24);
  border-radius: 4px;
  padding: 8px 12px;
  color: var(--color-muted);
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
}

.trading-actions button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

@media (max-width: 1180px) {
  .trading-page__main-grid {
    grid-template-columns: 1fr;
  }
}
</style>
