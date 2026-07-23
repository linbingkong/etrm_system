import type { RouteRecordRaw } from 'vue-router';

import type { MenuItem } from '@/types/menu';

const componentMap = {
  'dashboard/DashboardHome': () => import('@/views/dashboard/DashboardHome.vue'),
} satisfies Record<string, () => Promise<unknown>>;

const pathComponentMap = {
  '/dashboard/quick-nav': () => import('@/views/dashboard/DashboardQuickNav.vue'),
  '/dashboard/notices': () => import('@/views/dashboard/DashboardNotices.vue'),
  '/market-monitoring/overview': () => import('@/views/market-monitoring/MarketOverview.vue'),
  '/market-monitoring/prices': () => import('@/views/market-monitoring/MarketPrices.vue'),
  '/market-monitoring/price-forecast': () => import('@/views/market-monitoring/PriceForecast.vue'),
  '/market-monitoring/supply-demand': () => import('@/views/market-monitoring/SupplyDemandAnalysis.vue'),
  '/market-monitoring/tie-line': () => import('@/views/market-monitoring/TieLineMonitor.vue'),
  '/market-monitoring/weather': () => import('@/views/market-monitoring/WeatherMonitor.vue'),
  '/market-monitoring/trading-calendar': () => import('@/views/market-monitoring/TradingCalendar.vue'),
  '/market-monitoring/market-params': () => import('@/views/market-monitoring/MarketParams.vue'),
  '/trading/overview': () => import('@/views/trading/TradingOverview.vue'),
  '/trading/long-term': () => import('@/views/trading/LongTermTrading.vue'),
  '/trading/spot-bid': () => import('@/views/trading/SpotBid.vue'),
  '/trading/d1-curve': () => import('@/views/trading/D1Curve.vue'),
  '/trading/todo': () => import('@/views/trading/TradingTodo.vue'),
  '/trading/done': () => import('@/views/trading/TradingDone.vue'),
  '/trading/rolling-matching': () => import('@/views/trading/TradingRollingMatching.vue'),
  '/trading/constraints': () => import('@/views/trading/TradingConstraints.vue'),
  '/trading/price-limits': () => import('@/views/trading/TradingPriceLimits.vue'),
  '/contracts/list': () => import('@/views/contracts/ContractsList.vue'),
  '/contracts/create': () => import('@/views/contracts/ContractCreate.vue'),
  '/contracts/templates': () => import('@/views/contracts/ContractTemplates.vue'),
  '/contracts/expiry-alerts': () => import('@/views/contracts/ContractExpiryAlerts.vue'),
  '/settlement/overview': () => import('@/views/settlement/SettlementOverview.vue'),
  '/settlement/bills': () => import('@/views/settlement/SettlementBills.vue'),
  '/settlement/review': () => import('@/views/settlement/SettlementReview.vue'),
  '/settlement/da-fee-check': () => import('@/views/settlement/SettlementDaFeeCheck.vue'),
  '/settlement/rt-fee-check': () => import('@/views/settlement/SettlementRtFeeCheck.vue'),
  '/settlement/monthly-deal-check': () => import('@/views/settlement/SettlementMonthlyDealCheck.vue'),
  '/settlement/average-price': () => import('@/views/settlement/SettlementAveragePrice.vue'),
  '/settlement/corrections': () => import('@/views/settlement/SettlementCorrections.vue'),
  '/generation/overview': () => import('@/views/generation/GenerationOverview.vue'),
  '/generation/monitoring': () => import('@/views/generation/GenerationMonitoring.vue'),
  '/generation/thermal': () => import('@/views/generation/GenerationThermal.vue'),
  '/generation/new-energy': () => import('@/views/generation/GenerationNewEnergy.vue'),
  '/generation/targets': () => import('@/views/generation/GenerationTargets.vue'),
  '/generation/green-energy-targets': () => import('@/views/generation/GenerationGreenEnergyTargets.vue'),
  '/generation/start-stop': () => import('@/views/generation/GenerationStartStop.vue'),
  '/generation/units': () => import('@/views/generation/GenerationUnits.vue'),
  '/generation/equipment-check': () => import('@/views/generation/GenerationEquipmentCheck.vue'),
  '/load/overview': () => import('@/views/load/LoadOverview.vue'),
  '/load/monitoring': () => import('@/views/load/LoadMonitoring.vue'),
  '/load/local': () => import('@/views/load/LoadLocal.vue'),
  '/load/self-use': () => import('@/views/load/LoadSelfUse.vue'),
  '/load/net-load': () => import('@/views/load/LoadNetLoad.vue'),
  '/load/curtailment': () => import('@/views/load/LoadCurtailment.vue'),
  '/load/province-load': () => import('@/views/load/LoadProvinceLoad.vue'),
  '/reports/analysis-center': () => import('@/views/reports/AnalysisCenter.vue'),
  '/reports/profit-loss': () => import('@/views/reports/ProfitLossAnalysis.vue'),
  '/reports/monthly-report': () => import('@/views/reports/MonthlyReport.vue'),
  '/reports/statistics': () => import('@/views/reports/ReportsStatistics.vue'),
  '/reports/contrast': () => import('@/views/reports/ReportsContrast.vue'),
  '/reports/site-analysis': () => import('@/views/reports/ReportsSiteAnalysis.vue'),
  '/reports/charts': () => import('@/views/reports/ReportsCharts.vue'),
  '/reports/export': () => import('@/views/reports/ReportsExport.vue'),
  '/reports/similar-analysis': () => import('@/views/reports/ReportsSimilarAnalysis.vue'),
  '/strategy/list': () => import('@/views/strategy/StrategyList.vue'),
  '/strategy/create': () => import('@/views/strategy/StrategyCreate.vue'),
  '/strategy/economic': () => import('@/views/strategy/StrategyEconomic.vue'),
  '/strategy/intro': () => import('@/views/strategy/StrategyIntro.vue'),
  '/strategy/monthly-model': () => import('@/views/strategy/StrategyMonthlyModel.vue'),
  '/strategy/weights': () => import('@/views/strategy/StrategyWeights.vue'),
  '/retail/overview': () => import('@/views/retail/RetailOverview.vue'),
  '/retail/product-structure': () => import('@/views/retail/RetailProductStructure.vue'),
  '/retail/packages': () => import('@/views/retail/RetailPackages.vue'),
  '/assessment/two-assessment-analysis': () => import('@/views/assessment/AssessmentTwoAssessmentAnalysis.vue'),
  '/assessment/two-criteria-check': () => import('@/views/assessment/AssessmentTwoCriteriaCheck.vue'),
  '/assessment/criteria-info': () => import('@/views/assessment/AssessmentCriteriaInfo.vue'),
  '/assessment/other-check': () => import('@/views/assessment/AssessmentOtherCheck.vue'),
  '/assessment/criteria-config': () => import('@/views/assessment/AssessmentCriteriaConfig.vue'),
  '/assessment/recover-check': () => import('@/views/assessment/AssessmentRecoverCheck.vue'),
  '/system-admin/users': () => import('@/views/system-admin/UserManagement.vue'),
  '/system-admin/roles': () => import('@/views/system-admin/RoleManagement.vue'),
  '/system-admin/menus': () => import('@/views/system-admin/MenuManagement.vue'),
  '/system-admin/permission-nodes': () => import('@/views/system-admin/PermissionNodes.vue'),
  '/system-admin/dictionaries': () => import('@/views/system-admin/DictionaryManagement.vue'),
  '/system-admin/messages': () => import('@/views/system-admin/MessageNotifications.vue'),
  '/system-admin/configurations': () => import('@/views/system-admin/ConfigurationManagement.vue'),
  '/system-admin/templates': () => import('@/views/system-admin/SystemTemplates.vue'),
  '/system-admin/imports': () => import('@/views/system-admin/DataImports.vue'),
  '/system-admin/basic-info': () => import('@/views/system-admin/BasicInfo.vue'),
  '/system-admin/visit-analysis': () => import('@/views/system-admin/VisitAnalysis.vue'),
  '/integrations/realtime': () => import('@/views/integrations/IntegrationRealtime.vue'),
  '/integrations/shandong-api': () => import('@/views/integrations/IntegrationShandongApi.vue'),
  '/integrations/market-board': () => import('@/views/integrations/IntegrationMarketBoard.vue'),
  '/integrations/token-login': () => import('@/views/integrations/IntegrationTokenLogin.vue'),
  '/integrations/file-preview': () => import('@/views/integrations/IntegrationFilePreview.vue'),
} satisfies Record<string, () => Promise<unknown>>;

const PlaceholderPage = () => import('@/views/PlaceholderPage.vue');

function resolvePageComponent(path: string, component?: string) {
  if (component && component in componentMap) {
    return componentMap[component as keyof typeof componentMap];
  }
  if (path in pathComponentMap) {
    return pathComponentMap[path as keyof typeof pathComponentMap];
  }
  return PlaceholderPage;
}

export function buildRoutesFromMenus(menuItems: MenuItem[]): RouteRecordRaw[] {
  const pageRoutes = menuItems.flatMap((item) =>
    (item.children ?? []).map((child) => ({
      path: child.path,
      component: resolvePageComponent(child.path, child.component),
      meta: {
        title: child.metaTitle ?? child.title,
        permission: child.permission,
        priority: child.priority,
      },
    })),
  );

  const redirects = menuItems
    .map((item) => ({
      path: item.path,
      redirect: item.redirect ?? item.children?.[0]?.path ?? '/dashboard',
    }))
    .filter((item) => item.path !== item.redirect);

  return [{ path: '/', redirect: '/dashboard' }, ...redirects, ...pageRoutes];
}
