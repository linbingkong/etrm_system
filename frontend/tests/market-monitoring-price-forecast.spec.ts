import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import { routes } from '../src/router';
import { flattenMenuItems, menuItems } from '../src/router/menu-items';
import { buildPriceForecastOption } from '../src/views/market-monitoring/market-monitoring-chart';
import {
  getPriceForecastPoints,
  priceForecastPoints24,
  priceForecastPoints96,
  priceForecastRisks,
  priceForecastSummaryItems,
} from '../src/views/market-monitoring/market-monitoring.mock';
import PriceForecast from '../src/views/market-monitoring/PriceForecast.vue';

function getXAxisDataLength(option: ReturnType<typeof buildPriceForecastOption>) {
  const xAxis = Array.isArray(option.xAxis) ? option.xAxis[0] : option.xAxis;
  return ((xAxis as { data?: unknown[] })?.data ?? []).length;
}

describe('PriceForecast', () => {
  it('renders the price forecast decision support layout', () => {
    const wrapper = mount(PriceForecast, {
      global: {
        stubs: {
          PriceForecastChart: {
            template: '<section data-test="price-forecast-chart" />',
          },
        },
      },
    });

    expect(wrapper.text()).toContain('价格预测');
    expect(wrapper.find('[data-test="price-forecast-filter"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="price-forecast-summary"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="price-forecast-chart"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="price-forecast-risk"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="price-forecast-table"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('24点');
    expect(wrapper.text()).toContain('96点');
    expect(wrapper.text()).toContain('交易日期范围');
    expect(wrapper.text()).toContain('模型版本');
    expect(priceForecastSummaryItems).toHaveLength(4);
    expect(priceForecastRisks.length).toBeGreaterThanOrEqual(3);
  });

  it('supports 24-point and 96-point forecast chart displays', () => {
    const option24 = buildPriceForecastOption(getPriceForecastPoints('24'));
    const option96 = buildPriceForecastOption(getPriceForecastPoints('96'));
    const series = Array.isArray(option96.series) ? option96.series : [];

    expect(priceForecastPoints24).toHaveLength(24);
    expect(priceForecastPoints96).toHaveLength(96);
    expect(getXAxisDataLength(option24)).toBe(24);
    expect(getXAxisDataLength(option96)).toBe(96);
    expect(series.map((item) => item.name)).toContain('预测价格');
    expect(series.map((item) => item.name)).toContain('实际价格');
    expect(series.some((item) => item.name === '置信区间上限')).toBe(true);
  });

  it('adds price forecast to the market monitoring menu and routes', () => {
    const pageMenus = flattenMenuItems(menuItems).filter((item) => item.type === 'menu');
    const menu = pageMenus.find((item) => item.path === '/market-monitoring/price-forecast');
    const route = routes.find((item) => item.path === '/market-monitoring/price-forecast');

    expect(menu?.title).toBe('价格预测');
    expect(menu?.permission).toBe('market-monitoring:price-forecast');
    expect(menu?.visible).toBe(true);
    expect(route?.meta?.title).toBe('价格预测');
    expect(route?.component).not.toBeUndefined();
  });
});
