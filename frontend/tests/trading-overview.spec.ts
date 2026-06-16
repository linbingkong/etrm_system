import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import { routes } from '../src/router';
import TradingOverview from '../src/views/trading/TradingOverview.vue';

describe('TradingOverview', () => {
  it('renders trading overview sections', () => {
    const wrapper = mount(TradingOverview, {
      global: {
        stubs: {
          RouterLink: {
            props: ['to'],
            template: '<a :href="typeof to === `string` ? to : undefined"><slot /></a>',
          },
        },
      },
    });

    expect(wrapper.text()).toContain('交易总览');
    expect(wrapper.findAll('[data-test="trading-kpi-card"]')).toHaveLength(6);
    expect(wrapper.find('[data-test="trading-progress-panel"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="trading-risk-panel"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="trading-todo-panel"]').exists()).toBe(true);
    expect(wrapper.find('a[href="/trading/spot-bid"]').exists()).toBe(true);
    expect(wrapper.find('a[href="/trading/d1-curve"]').exists()).toBe(true);
  });

  it('binds /trading/overview to a real page component', () => {
    const route = routes.find((item) => item.path === '/trading/overview');

    expect(route?.meta?.title).toBe('交易总览');
    expect(route?.component).not.toBeUndefined();
  });
});
