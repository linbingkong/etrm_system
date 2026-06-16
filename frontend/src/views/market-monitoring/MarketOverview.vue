<script setup lang="ts">
import MarketFilterBar from './components/MarketFilterBar.vue';
import MarketKpiGrid from './components/MarketKpiGrid.vue';
import MarketTrendPanel from './components/MarketTrendPanel.vue';
import RiskWatchPanel from './components/RiskWatchPanel.vue';
import SupplyDemandPanel from './components/SupplyDemandPanel.vue';
import {
  marketFilter,
  marketKpis,
  marketPricePoints,
  marketQuickLinks,
  marketRiskEvents,
  supplyDemandItems,
} from './market-monitoring.mock';
</script>

<template>
  <section class="market-page">
    <header class="market-page__title">
      <div>
        <p>Market Monitoring</p>
        <h2>市场行情总览</h2>
      </div>
      <span>实时 / 准实时行情观察</span>
    </header>

    <MarketFilterBar :filter="marketFilter" />
    <MarketKpiGrid :items="marketKpis" />

    <div class="market-page__main-grid">
      <MarketTrendPanel :points="marketPricePoints" />
      <RiskWatchPanel :risks="marketRiskEvents" />
    </div>

    <div class="market-page__bottom-grid">
      <SupplyDemandPanel :items="supplyDemandItems" />
      <section class="dashboard-card market-nodes">
        <div class="dashboard-card__header">
          <h3>交易节点</h3>
          <span>今日</span>
        </div>
        <ol>
          <li><router-link to="/market-monitoring/trading-calendar"><strong>09:30</strong><span>日前价格发布</span></router-link></li>
          <li><router-link to="/market-monitoring/trading-calendar"><strong>13:45</strong><span>申报窗口关闭</span></router-link></li>
          <li><router-link to="/market-monitoring/trading-calendar"><strong>15:30</strong><span>实时滚动出清</span></router-link></li>
        </ol>
      </section>
      <section class="dashboard-card market-links">
        <div class="dashboard-card__header">
          <h3>快捷入口</h3>
          <span>P0/P1</span>
        </div>
        <router-link v-for="link in marketQuickLinks" :key="link.path" :to="link.path">
          <strong>{{ link.title }}</strong>
          <span>{{ link.description }}</span>
        </router-link>
      </section>
    </div>
  </section>
</template>

<style scoped>
.market-page {
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

.market-page__title {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
}

.market-page__title p,
.market-page__title span {
  margin: 0;
  color: var(--color-muted);
  font-size: 12px;
}

.market-page__title h2 {
  margin: 4px 0 0;
  color: #ffffff;
  font-size: 24px;
}

.market-page__main-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(320px, 1fr);
  gap: 16px;
}

.market-page__bottom-grid {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(260px, 2fr) minmax(280px, 2fr);
  gap: 16px;
}

.market-nodes ol {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.market-nodes li {
  border-bottom: 1px solid rgba(143, 155, 186, 0.12);
}

.market-nodes a {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  color: inherit;
  text-decoration: none;
}

.market-nodes strong {
  color: var(--color-primary);
  font-family: var(--font-number);
}

.market-nodes span {
  color: var(--color-muted);
}

.market-links {
  display: grid;
  gap: 10px;
  align-content: start;
}

.market-links a {
  display: grid;
  gap: 4px;
  padding: 10px;
  border: 1px solid rgba(0, 242, 254, 0.12);
  border-radius: 4px;
  color: inherit;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.03);
}

.market-links strong {
  color: #ffffff;
  font-size: 14px;
}

.market-links span {
  color: var(--color-muted);
  font-size: 12px;
}

@media (max-width: 1180px) {
  .market-page__main-grid,
  .market-page__bottom-grid {
    grid-template-columns: 1fr;
  }
}
</style>
