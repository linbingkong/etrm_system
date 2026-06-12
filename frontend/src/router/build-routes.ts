import type { RouteRecordRaw } from 'vue-router';

import type { MenuItem } from '@/types/menu';

const PlaceholderPage = () => import('@/views/PlaceholderPage.vue');

export function buildRoutesFromMenus(menuItems: MenuItem[]): RouteRecordRaw[] {
  const pageRoutes = menuItems.flatMap((item) =>
    (item.children ?? []).map((child) => ({
      path: child.path,
      component: PlaceholderPage,
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
