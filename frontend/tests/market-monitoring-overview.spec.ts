import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import { routes } from '../src/router';
import { buildMarketOverviewOption } from '../src/views/market-monitoring/market-monitoring-chart';
import { marketPricePoints } from '../src/views/market-monitoring/market-monitoring.mock';
import MarketOverview from '../src/views/market-monitoring/MarketOverview.vue';

describe('MarketOverview', () => {
  it('renders the market overview dashboard sections', () => {
    const wrapper = mount(MarketOverview, {
      global: {
        stubs: {
          RouterLink: {
            props: ['to'],
            template: '<a :href="typeof to === `string` ? to : undefined"><slot /></a>',
          },
          MarketTrendPanel: true,
        },
      },
    });

    expect(wrapper.text()).toContain('市场行情总览');
    expect(wrapper.findAll('[data-test="market-kpi-card"]')).toHaveLength(6);
    expect(wrapper.find('[data-test="market-filter-bar"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="supply-demand-panel"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="risk-watch-panel"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('价格监测');
    expect(wrapper.text()).toContain('现货交易申报');
    expect(wrapper.find('a[href="/trading/spot-bid"]').exists()).toBe(true);
    expect(wrapper.find('a[href="/market-monitoring/trading-calendar"]').exists()).toBe(true);
    expect(wrapper.find('a[href="/market-monitoring/supply-demand"]').exists()).toBe(true);
  });

  it('builds overview chart option with price and load series', () => {
    const option = buildMarketOverviewOption(marketPricePoints);
    const series = Array.isArray(option.series) ? option.series : [];

    expect(series).toHaveLength(4);
    expect(series[0]).toMatchObject({ name: '日前价格' });
    expect(series[1]).toMatchObject({ name: '实时价格' });
    expect(series[0]).toHaveProperty('markLine');
  });

  it('binds /market-monitoring/overview to a real page component', () => {
    const route = routes.find((item) => item.path === '/market-monitoring/overview');

    expect(route?.meta?.title).toBe('市场行情总览');
    expect(route?.component).not.toBeUndefined();
  });
});
