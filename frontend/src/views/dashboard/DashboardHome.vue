<script setup lang="ts">
import BusinessDataPanel from './components/BusinessDataPanel.vue';
import KpiCardGrid from './components/KpiCardGrid.vue';
import NoticePanel from './components/NoticePanel.vue';
import QuickNavPanel from './components/QuickNavPanel.vue';
import TaskPanel from './components/TaskPanel.vue';
import TrendChartPanel from './components/TrendChartPanel.vue';
import WorkbenchHeader from './components/WorkbenchHeader.vue';
import {
  dashboardBusinessData,
  dashboardKpis,
  dashboardNotices,
  dashboardProfile,
  dashboardQuickNavs,
  dashboardTasks,
  dashboardTrendPoints,
} from './dashboard.mock';
</script>

<template>
  <section class="dashboard-home">
    <WorkbenchHeader :profile="dashboardProfile" />
    <KpiCardGrid :items="dashboardKpis" />
    <div class="dashboard-home__main-grid">
      <TrendChartPanel :points="dashboardTrendPoints" />
      <TaskPanel :tasks="dashboardTasks" />
    </div>
    <div class="dashboard-home__bottom-grid">
      <QuickNavPanel :items="dashboardQuickNavs" />
      <NoticePanel :notices="dashboardNotices" />
      <BusinessDataPanel :items="dashboardBusinessData" />
    </div>
  </section>
</template>

<style scoped>
.dashboard-home {
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

.dashboard-home__main-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(320px, 1fr);
  gap: 16px;
}

.dashboard-home__bottom-grid {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 3fr) minmax(260px, 2fr);
  gap: 16px;
}

@media (max-width: 1180px) {
  .dashboard-home__main-grid,
  .dashboard-home__bottom-grid {
    grid-template-columns: 1fr;
  }
}
</style>
