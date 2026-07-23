import { describe, expect, it } from 'vitest';

import { flattenMenuItems, menuItems, visibleMenuItems } from '../src/router/menu-items';

describe('menuItems', () => {
  it('contains 13 top-level modules', () => {
    expect(menuItems).toHaveLength(13);
  });

  it('contains 88 page menu items', () => {
    const pageMenus = flattenMenuItems(menuItems).filter((item) => item.type === 'menu');

    expect(pageMenus).toHaveLength(88);
  });

  it('contains key routes and permissions', () => {
    const pageMenus = flattenMenuItems(menuItems);
    const paths = pageMenus.map((item) => item.path);
    const permissions = pageMenus.map((item) => item.permission);

    expect(paths).toContain('/trading/spot-bid');
    expect(paths).toContain('/market-monitoring/price-forecast');
    expect(paths).toContain('/settlement/review');
    expect(paths).toContain('/system-admin/menus');
    expect(paths).toContain('/integrations/shandong-api');
    expect(permissions).toContain('trading:spot-bid');
    expect(permissions).toContain('market-monitoring:price-forecast');
    expect(permissions).toContain('settlement:review');
  });

  it('shows completed market monitoring pages in the sidebar menu', () => {
    const visiblePaths = flattenMenuItems(visibleMenuItems(menuItems)).map((item) => item.path);

    expect(visiblePaths).toContain('/market-monitoring/market-params');
    expect(visiblePaths).toContain('/contracts/expiry-alerts');
    expect(visiblePaths).toContain('/system-admin/visit-analysis');
  });

  it('removes photovoltaic detail page from the menu model', () => {
    const allPaths = flattenMenuItems(menuItems).map((item) => item.path);
    const visiblePaths = flattenMenuItems(visibleMenuItems(menuItems)).map((item) => item.path);

    expect(allPaths).not.toContain('/generation/pv');
    expect(visiblePaths).not.toContain('/generation/pv');
  });

  it('hides P2 page menus by default', () => {
    const p2Menus = flattenMenuItems(menuItems).filter((item) => item.type === 'menu' && item.priority === 'P2');

    expect(p2Menus.length).toBeGreaterThan(0);
    expect(p2Menus.every((item) => item.visible === false)).toBe(true);
  });
});
