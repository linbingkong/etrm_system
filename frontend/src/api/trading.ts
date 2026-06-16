import { requestJson } from './http';
import type { StorageStrategyRequest, StorageStrategyResponse } from '@/views/trading/trading.types';

export function generateStorageStrategy(payload: StorageStrategyRequest): Promise<StorageStrategyResponse> {
  return requestJson<StorageStrategyResponse>('/trading/spot-bid/storage-strategy', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
