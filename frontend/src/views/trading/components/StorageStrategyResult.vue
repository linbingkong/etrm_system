<script setup lang="ts">
import type { StorageBidSegment, StorageStrategyResponse } from '../trading.types';

const props = defineProps<{ result: StorageStrategyResponse; error: string }>();

type SegmentField = keyof StorageBidSegment;
type SegmentKind = 'charge' | 'discharge';

function getSegments(kind: SegmentKind) {
  return kind === 'charge' ? props.result.charge_segments : props.result.discharge_segments;
}

function updateSegment(kind: SegmentKind, index: number, field: SegmentField, event: Event) {
  const value = Number((event.target as HTMLInputElement).value);
  if (Number.isFinite(value)) {
    getSegments(kind)[index][field] = value;
  }
}

function addSegment(kind: SegmentKind) {
  const segments = getSegments(kind);
  const previous = segments.at(-1);
  segments.push({
    p_start: previous?.p_end ?? (kind === 'charge' ? -100 : 0),
    p_end: kind === 'charge' ? 0 : (previous?.p_end ?? 90) + 10,
    price: previous?.price ?? (kind === 'charge' ? 100 : 250),
  });
}

function removeSegment(kind: SegmentKind, index: number) {
  const segments = getSegments(kind);
  if (segments.length > 1) {
    segments.splice(index, 1);
  }
}
</script>

<template>
  <section class="dashboard-card strategy-result" data-test="storage-strategy-result">
    <div class="dashboard-card__header">
      <h3>充放电策略</h3>
      <span>{{ result.validation_passed ? '校验通过' : '存在校验问题' }}</span>
    </div>
    <p v-if="error" class="strategy-result__error">{{ error }}</p>
    <div class="strategy-result__tables">
      <div>
        <div class="strategy-result__table-title">
          <h4>充电量价曲线建议</h4>
          <button data-test="add-charge-segment" type="button" @click="addSegment('charge')">新增段</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>序号</th>
              <th>开始出力</th>
              <th>结束出力</th>
              <th>申报电价</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(segment, index) in result.charge_segments" :key="`charge-${index}`" data-test="charge-segment-row">
              <td>{{ index + 1 }}</td>
              <td>
                <input
                  :data-test="`charge-segment-start-${index}`"
                  type="number"
                  step="1"
                  :value="segment.p_start"
                  @input="updateSegment('charge', index, 'p_start', $event)"
                />
              </td>
              <td>
                <input
                  :data-test="`charge-segment-end-${index}`"
                  type="number"
                  step="1"
                  :value="segment.p_end"
                  @input="updateSegment('charge', index, 'p_end', $event)"
                />
              </td>
              <td>
                <input
                  :data-test="`charge-segment-price-${index}`"
                  type="number"
                  step="1"
                  :value="segment.price"
                  @input="updateSegment('charge', index, 'price', $event)"
                />
              </td>
              <td>
                <button type="button" :disabled="result.charge_segments.length <= 1" @click="removeSegment('charge', index)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <div class="strategy-result__table-title">
          <h4>放电量价曲线建议</h4>
          <button data-test="add-discharge-segment" type="button" @click="addSegment('discharge')">新增段</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>序号</th>
              <th>开始出力</th>
              <th>结束出力</th>
              <th>申报电价</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(segment, index) in result.discharge_segments" :key="`discharge-${index}`" data-test="discharge-segment-row">
              <td>{{ index + 1 }}</td>
              <td>
                <input
                  :data-test="`discharge-segment-start-${index}`"
                  type="number"
                  step="1"
                  :value="segment.p_start"
                  @input="updateSegment('discharge', index, 'p_start', $event)"
                />
              </td>
              <td>
                <input
                  :data-test="`discharge-segment-end-${index}`"
                  type="number"
                  step="1"
                  :value="segment.p_end"
                  @input="updateSegment('discharge', index, 'p_end', $event)"
                />
              </td>
              <td>
                <input
                  :data-test="`discharge-segment-price-${index}`"
                  type="number"
                  step="1"
                  :value="segment.price"
                  @input="updateSegment('discharge', index, 'price', $event)"
                />
              </td>
              <td>
                <button type="button" :disabled="result.discharge_segments.length <= 1" @click="removeSegment('discharge', index)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped>
.strategy-result__tables {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.strategy-result__table-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.strategy-result h4 {
  margin: 0;
  color: #ffffff;
  font-size: 14px;
}

.strategy-result table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 13px;
}

.strategy-result th {
  padding: 9px;
  background: #172554;
  color: #ffffff;
  text-align: left;
}

.strategy-result td {
  padding: 9px;
  border-bottom: 1px solid rgba(143, 155, 186, 0.12);
  color: var(--color-muted);
}

.strategy-result input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  border: 1px solid rgba(143, 155, 186, 0.32);
  border-radius: 4px;
  padding: 6px 8px;
  color: #e8f7ff;
  background: rgba(8, 20, 48, 0.86);
  outline: none;
}

.strategy-result input:focus {
  border-color: rgba(0, 242, 254, 0.72);
  box-shadow: 0 0 0 2px rgba(0, 242, 254, 0.12);
}

.strategy-result input::-webkit-outer-spin-button,
.strategy-result input::-webkit-inner-spin-button {
  margin: 0;
}

.strategy-result button {
  border: 1px solid rgba(0, 242, 254, 0.36);
  border-radius: 4px;
  padding: 6px 10px;
  color: var(--color-primary);
  background: rgba(0, 242, 254, 0.08);
  cursor: pointer;
  white-space: nowrap;
}

.strategy-result button:hover:not(:disabled) {
  border-color: rgba(0, 242, 254, 0.62);
  background: rgba(0, 242, 254, 0.14);
}

.strategy-result button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.strategy-result__error {
  color: var(--color-danger);
}

@media (max-width: 980px) {
  .strategy-result__tables {
    grid-template-columns: 1fr;
  }
}
</style>
