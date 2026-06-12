import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';

import { useAppStore } from '../src/stores/app.store';

describe('useAppStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('updates the trade date', () => {
    const store = useAppStore();

    store.setTradeDate('2026-06-12');

    expect(store.tradeDate).toBe('2026-06-12');
  });
});
