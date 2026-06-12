import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import { buildRoutesFromMenus } from './build-routes';
import { menuItems } from './menu-items';

export const routes: RouteRecordRaw[] = buildRoutesFromMenus(menuItems);

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
