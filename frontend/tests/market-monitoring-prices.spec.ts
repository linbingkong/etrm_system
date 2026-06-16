import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import { routes } from '../src/router';
import { buildPriceMonitorOption } from '../src/views/market-monitoring/market-monitoring-chart';
import { getMarketPricePoints, marketPricePoints, marketPricePoints24, marketPricePoints96, priceMonitorTabs } from '../src/views/market-monitoring/market-monitoring.mock';
import MarketPrices from '../src/views/market-monitoring/MarketPrices.vue';

function getXAxisDataLength(option: ReturnType<typeof buildPriceMonitorOption>) {
  const xAxis = Array.isArray(option.xAxis) ? option.xAxis[0] : option.xAxis;
  return ((xAxis as { data?: unknown[] })?.data ?? []).length;
}

describe('MarketPrices', () => {
  it('renders the price monitoring tabs and data table', () => {
    const wrapper = mount(MarketPrices, {
      global: {
        stubs: {
          PriceMonitorTabs: {
            template: '<section data-test="price-monitor-tabs" />',
          },
        },
      },
    });

    expect(wrapper.text()).toContain('价格监测');
    expect(wrapper.find('[data-test="market-filter-bar"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="price-monitor-tabs"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="price-summary"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="price-detail-table"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('24点');
    expect(wrapper.text()).toContain('96点');
    expect(priceMonitorTabs).toHaveLength(6);
    expect(priceMonitorTabs.map((tab) => tab.title)).toContain('日前出清价格');
    expect(priceMonitorTabs.map((tab) => tab.title)).toContain('市场价格排名');
    expect(wrapper.text()).toContain('均价');
    expect(wrapper.text()).toContain('峰值');
    expect(wrapper.text()).toContain('谷值');
    expect(wrapper.find('button[disabled]').text()).toBe('导出');
    expect(wrapper.text()).toContain('时段');
    expect(wrapper.text()).toContain('备注');
  });

  it('builds different chart options for each price monitor tab', () => {
    const dayAheadOption = buildPriceMonitorOption('day-ahead', marketPricePoints);
    const realtimeOption = buildPriceMonitorOption('realtime', marketPricePoints);
    const spotOption = buildPriceMonitorOption('spot', marketPricePoints);
    const spreadOption = buildPriceMonitorOption('spread', marketPricePoints);

    const dayAheadSeries = Array.isArray(dayAheadOption.series) ? dayAheadOption.series : [];
    const realtimeSeries = Array.isArray(realtimeOption.series) ? realtimeOption.series : [];
    const spotSeries = Array.isArray(spotOption.series) ? spotOption.series : [];
    const spreadSeries = Array.isArray(spreadOption.series) ? spreadOption.series : [];

    expect(dayAheadSeries.map((item) => item.name)).toEqual(['日前价格']);
    expect(realtimeSeries.map((item) => item.name)).toEqual(['实时价格']);
    expect(spotSeries.map((item) => item.name)).toEqual(['日前价格', '实时价格', '现货价格']);
    expect(spreadSeries.map((item) => item.name)).toEqual(['价差']);
    expect(dayAheadSeries[0]).toHaveProperty('markLine');
  });

  it('supports 24-point and 96-point price displays', () => {
    const option24 = buildPriceMonitorOption('spot', getMarketPricePoints('24'));
    const option96 = buildPriceMonitorOption('spot', getMarketPricePoints('96'));

    expect(marketPricePoints24).toHaveLength(24);
    expect(marketPricePoints96).toHaveLength(96);
    expect(getXAxisDataLength(option24)).toBe(24);
    expect(getXAxisDataLength(option96)).toBe(96);
  });

  it('binds /market-monitoring/prices to a real page component', () => {
    const route = routes.find((item) => item.path === '/market-monitoring/prices');

    expect(route?.meta?.title).toBe('价格监测');
    expect(route?.component).not.toBeUndefined();
  });
});
