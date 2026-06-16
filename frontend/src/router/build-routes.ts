import type { RouteRecordRaw } from 'vue-router';

import type { MenuItem } from '@/types/menu';

const componentMap = {
  'dashboard/DashboardHome': () => import('@/views/dashboard/DashboardHome.vue'),
} satisfies Record<string, () => Promise<unknown>>;

const pathComponentMap = {
  '/market-monitoring/overview': () => import('@/views/market-monitoring/MarketOverview.vue'),
  '/market-monitoring/prices': () => import('@/views/market-monitoring/MarketPrices.vue'),
  '/market-monitoring/price-forecast': () => import('@/views/market-monitoring/PriceForecast.vue'),
  '/trading/overview': () => import('@/views/trading/TradingOverview.vue'),
  '/trading/spot-bid': () => import('@/views/trading/SpotBid.vue'),
  '/trading/d1-curve': () => import('@/views/trading/D1Curve.vue'),
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
