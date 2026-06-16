import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import { routes } from '../src/router';
import { buildPriceTrendOption } from '../src/views/dashboard/dashboard-chart';
import { dashboardTrendPoints } from '../src/views/dashboard/dashboard.mock';
import DashboardHome from '../src/views/dashboard/DashboardHome.vue';

describe('DashboardHome', () => {
  it('renders the dashboard sections', () => {
    const wrapper = mount(DashboardHome, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
          ElEmpty: {
            template: '<div />',
          },
          TrendChartPanel: true,
        },
      },
    });

    expect(wrapper.text()).toContain('工作台首页');
    expect(wrapper.findAll('[data-test="kpi-card"]')).toHaveLength(5);
    expect(wrapper.text()).toContain('现货交易申报');
    expect(wrapper.text()).toContain('D1 曲线申报');
    expect(wrapper.text()).toContain('结算审核');
    expect(wrapper.find('[data-test="task-panel"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="notice-panel"]').exists()).toBe(true);
  });

  it('builds a price trend option with two series and mark lines', () => {
    const option = buildPriceTrendOption(dashboardTrendPoints);
    const series = Array.isArray(option.series) ? option.series : [];

    expect(series).toHaveLength(2);
    expect(series[0]).toMatchObject({ name: '日前价格' });
    expect(series[1]).toMatchObject({ name: '实时价格' });
    expect(series[0]).toHaveProperty('markLine');
  });

  it('binds /dashboard to the dashboard page component', () => {
    const dashboardRoute = routes.find((route) => route.path === '/dashboard');

    expect(dashboardRoute?.meta?.title).toBe('工作台首页');
    expect(dashboardRoute?.component).not.toBeUndefined();
  });
});
