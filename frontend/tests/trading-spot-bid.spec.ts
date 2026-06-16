import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import { generateStorageStrategy } from '../src/api/trading';
import { routes } from '../src/router';
import { buildStoragePowerOption } from '../src/views/trading/trading-chart';
import {
  defaultStorageStrategyRequest,
  defaultStorageStrategyResult,
  getSpotBidPoints,
  spotBidPoints24,
  spotBidPoints96,
} from '../src/views/trading/trading.mock';
import StorageStrategyResult from '../src/views/trading/components/StorageStrategyResult.vue';
import SpotBid from '../src/views/trading/SpotBid.vue';
import type { StorageStrategyResponse } from '../src/views/trading/trading.types';

describe('SpotBid', () => {
  it('renders the independent storage strategy workspace', () => {
    const wrapper = mount(SpotBid, {
      global: {
        stubs: {
          StoragePriceForecastChart: true,
          StorageStrategyChart: true,
        },
      },
    });

    expect(wrapper.text()).toContain('现货交易申报');
    expect(wrapper.text()).toContain('独立储能日前策略');
    expect(wrapper.find('[data-test="storage-price-chart"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="storage-strategy-list"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="storage-stepper"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="storage-parameter-form"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="storage-strategy-result"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="storage-profit-panel"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('填写参数');
    expect(wrapper.text()).toContain('充放电策略');
    expect(wrapper.text()).toContain('策略收益测算');
    expect(wrapper.text()).toContain('额定充电功率');
    expect(wrapper.text()).toContain('荷电状态(SOC)');
    expect(wrapper.text()).toContain('生成策略');
  });

  it('supports 24-point and 96-point forecast displays while strategy uses 96 points', () => {
    const option24 = buildStoragePowerOption(getSpotBidPoints('24'));
    const option96 = buildStoragePowerOption(getSpotBidPoints('96'));

    expect(spotBidPoints24).toHaveLength(24);
    expect(spotBidPoints96).toHaveLength(96);
    expect(getXAxisDataLength(option24)).toBe(24);
    expect(getXAxisDataLength(option96)).toBe(96);
    expect(defaultStorageStrategyRequest.charge_price_signal).toHaveLength(96);
    expect(defaultStorageStrategyRequest.discharge_price_signal).toHaveLength(96);
  });

  it('binds /trading/spot-bid to a real page component', () => {
    const route = routes.find((item) => item.path === '/trading/spot-bid');

    expect(route?.meta?.title).toBe('现货交易申报');
    expect(route?.component).not.toBeUndefined();
  });

  it('posts storage strategy parameters to the backend API', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        station_id: 'storage-001',
        node_id: 'sd-node-001',
        market_date: '2026-06-17',
        strategy: 'milp_optimization',
        validation_passed: true,
        validation_errors: [],
        submission_packet: { daily_params: { expected_profit_yuan: 1200 } },
        charge_segments: [{ p_start: -100, p_end: 0, price: 100 }],
        discharge_segments: [{ p_start: 0, p_end: 90, price: 680 }],
        derived_feasible_power_mw: Array.from({ length: 96 }, () => 0),
        derived_soc: Array.from({ length: 97 }, () => 0.05),
      }),
    } as Response);

    const result = await generateStorageStrategy(defaultStorageStrategyRequest);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/trading/spot-bid/storage-strategy'),
      expect.objectContaining({ method: 'POST' }),
    );
    expect(result.validation_passed).toBe(true);
    expect(result.charge_segments).toHaveLength(1);
    fetchMock.mockRestore();
  });

  it('posts edited storage parameters when generating strategy from the page', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        station_id: 'storage-001',
        node_id: 'sd-node-001',
        market_date: '2026-06-17',
        strategy: 'milp_optimization',
        validation_passed: true,
        validation_errors: [],
        submission_packet: { daily_params: { expected_profit_yuan: 1500 } },
        charge_segments: [{ p_start: -120, p_end: 0, price: 100 }],
        discharge_segments: [{ p_start: 0, p_end: 90, price: 680 }],
        derived_feasible_power_mw: Array.from({ length: 96 }, () => 0),
        derived_soc: Array.from({ length: 97 }, () => 0.05),
      }),
    } as Response);

    const wrapper = mount(SpotBid, {
      global: {
        stubs: {
          StoragePriceForecastChart: true,
          StorageStrategyChart: true,
        },
      },
    });

    const chargePowerInput = wrapper.find<HTMLInputElement>('input[name="p_charge_max_mw"]');
    expect(chargePowerInput.exists()).toBe(true);
    expect(chargePowerInput.element.readOnly).toBe(false);

    await chargePowerInput.setValue('120');
    await wrapper.find('[data-test="generate-storage-strategy"]').trigger('click');
    await flushPromises();

    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined;
    const payload = JSON.parse(String(requestInit?.body));
    expect(payload.p_charge_max_mw).toBe(120);
    expect(payload.charge_price_signal).toHaveLength(96);
    fetchMock.mockRestore();
  });

  it('allows manual editing and adding charge bid curve segments', async () => {
    const result = cloneStorageStrategyResult();
    const wrapper = mount(StorageStrategyResult, {
      props: {
        result,
        error: '',
      },
    });

    expect(wrapper.findAll('[data-test="charge-segment-row"]')).toHaveLength(2);

    await wrapper.find('[data-test="charge-segment-price-0"]').setValue('88');
    expect(result.charge_segments[0].price).toBe(88);

    await wrapper.find('[data-test="add-charge-segment"]').trigger('click');
    expect(result.charge_segments).toHaveLength(3);
    expect(wrapper.findAll('[data-test="charge-segment-row"]')).toHaveLength(3);

    await wrapper.find('[data-test="charge-segment-start-2"]').setValue('-60');
    await wrapper.find('[data-test="charge-segment-end-2"]').setValue('-20');
    await wrapper.find('[data-test="charge-segment-price-2"]').setValue('120');

    expect(result.charge_segments[2]).toEqual({ p_start: -60, p_end: -20, price: 120 });
  });

  it('allows manual editing and adding discharge bid curve segments', async () => {
    const result = cloneStorageStrategyResult();
    const wrapper = mount(StorageStrategyResult, {
      props: {
        result,
        error: '',
      },
    });

    expect(wrapper.findAll('[data-test="discharge-segment-row"]')).toHaveLength(2);

    await wrapper.find('[data-test="discharge-segment-price-0"]').setValue('360');
    expect(result.discharge_segments[0].price).toBe(360);

    await wrapper.find('[data-test="add-discharge-segment"]').trigger('click');
    expect(result.discharge_segments).toHaveLength(3);
    expect(wrapper.findAll('[data-test="discharge-segment-row"]')).toHaveLength(3);

    await wrapper.find('[data-test="discharge-segment-start-2"]').setValue('100');
    await wrapper.find('[data-test="discharge-segment-end-2"]').setValue('120');
    await wrapper.find('[data-test="discharge-segment-price-2"]').setValue('1450');

    expect(result.discharge_segments[2]).toEqual({ p_start: 100, p_end: 120, price: 1450 });
  });
});

function getXAxisDataLength(option: ReturnType<typeof buildStoragePowerOption>) {
  const xAxis = Array.isArray(option.xAxis) ? option.xAxis[0] : option.xAxis;
  return ((xAxis as { data?: unknown[] })?.data ?? []).length;
}

function cloneStorageStrategyResult(): StorageStrategyResponse {
  return JSON.parse(JSON.stringify(defaultStorageStrategyResult)) as StorageStrategyResponse;
}
