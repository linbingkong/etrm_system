import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    currentMarket: 'shandong',
    tradeDate: '',
  }),
  actions: {
    setTradeDate(tradeDate: string) {
      this.tradeDate = tradeDate;
    },
  },
});
