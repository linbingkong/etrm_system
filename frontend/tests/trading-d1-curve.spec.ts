import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import { routes } from '../src/router';
import { buildD1CurveOption } from '../src/views/trading/trading-chart';
import { d1CurvePoints } from '../src/views/trading/trading.mock';
import D1Curve from '../src/views/trading/D1Curve.vue';

describe('D1Curve', () => {
  it('renders D1 curve chart, validation and table', () => {
    const wrapper = mount(D1Curve, {
      global: {
        stubs: {
          D1CurveChart: true,
        },
      },
    });

    expect(wrapper.text()).toContain('D1 曲线申报');
    expect(wrapper.find('[data-test="trading-filter-bar"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="validation-panel"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="d1-curve-table"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('保存草稿');
    expect(wrapper.text()).toContain('提交');
  });

  it('builds D1 curve option with plan, declared and deviation series', () => {
    const option = buildD1CurveOption(d1CurvePoints);
    const series = Array.isArray(option.series) ? option.series : [];

    expect(series.map((item) => item.name)).toEqual(['计划曲线', '申报曲线', '偏差']);
  });

  it('binds /trading/d1-curve to a real page component', () => {
    const route = routes.find((item) => item.path === '/trading/d1-curve');

    expect(route?.meta?.title).toBe('D1 曲线申报');
    expect(route?.component).not.toBeUndefined();
  });
});
