<script setup lang="ts">
import TradingFilterBar from './components/TradingFilterBar.vue';
import TradingKpiGrid from './components/TradingKpiGrid.vue';
import TradingProgressPanel from './components/TradingProgressPanel.vue';
import TradingRiskPanel from './components/TradingRiskPanel.vue';
import TradingTodoPanel from './components/TradingTodoPanel.vue';
import { tradingKpis, tradingProgressSteps, tradingRisks, tradingSession, tradingTodos } from './trading.mock';
</script>

<template>
  <section class="trading-page">
    <header class="trading-page__title">
      <div>
        <p>Trading Management</p>
        <h2>交易总览</h2>
      </div>
      <span>申报进度 / 风险 / 待办</span>
    </header>

    <TradingFilterBar :session="tradingSession" />
    <TradingKpiGrid :items="tradingKpis" />

    <div class="trading-page__main-grid">
      <TradingProgressPanel :steps="tradingProgressSteps" />
      <TradingRiskPanel :risks="tradingRisks" />
    </div>

    <div class="trading-page__bottom-grid">
      <TradingTodoPanel :todos="tradingTodos" />
      <section class="dashboard-card trading-summary">
        <div class="dashboard-card__header">
          <h3>交易结果摘要</h3>
          <span>今日</span>
        </div>
        <div><strong class="dashboard-number">18,420</strong><span>MWh 成交电量</span></div>
        <div><strong class="dashboard-number">386.24</strong><span>元/MWh 申报均价</span></div>
      </section>
      <section class="dashboard-card trading-links">
        <div class="dashboard-card__header">
          <h3>快捷入口</h3>
          <span>P0</span>
        </div>
        <router-link to="/trading/spot-bid"><strong>现货交易申报</strong><span>进入量价申报</span></router-link>
        <router-link to="/trading/d1-curve"><strong>D1 曲线申报</strong><span>维护发电曲线</span></router-link>
        <router-link to="/market-monitoring/prices"><strong>价格监测</strong><span>查看参考价格</span></router-link>
      </section>
    </div>
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

.trading-page__title,
.trading-page__main-grid,
.trading-page__bottom-grid {
  display: grid;
  gap: 16px;
}

.trading-page__title {
  display: flex;
  align-items: end;
  justify-content: space-between;
}

.trading-page__title p,
.trading-page__title span,
.trading-summary span,
.trading-links span {
  margin: 0;
  color: var(--color-muted);
  font-size: 12px;
}

.trading-page__title h2 {
  margin: 4px 0 0;
  color: #ffffff;
  font-size: 24px;
}

.trading-page__main-grid {
  grid-template-columns: minmax(0, 2fr) minmax(320px, 1fr);
}

.trading-page__bottom-grid {
  grid-template-columns: minmax(0, 3fr) minmax(260px, 2fr) minmax(280px, 2fr);
}

.trading-summary {
  display: grid;
  gap: 12px;
}

.trading-links {
  display: grid;
  gap: 10px;
  align-content: start;
}

.trading-links a {
  display: grid;
  gap: 4px;
  padding: 10px;
  border: 1px solid rgba(0, 242, 254, 0.12);
  border-radius: 4px;
  color: inherit;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.03);
}

.trading-links strong {
  color: #ffffff;
  font-size: 14px;
}

@media (max-width: 1180px) {
  .trading-page__main-grid,
  .trading-page__bottom-grid {
    grid-template-columns: 1fr;
  }
}
</style>
