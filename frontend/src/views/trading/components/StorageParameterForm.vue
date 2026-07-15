<script setup lang="ts">
import type { StorageStrategyRequest } from '../trading.types';

const props = defineProps<{ model: StorageStrategyRequest; loading: boolean; strategyName: string }>();
defineEmits<{ generate: []; 'update:strategyName': [value: string] }>();

type NumericField =
  | 'p_charge_max_mw'
  | 'p_discharge_max_mw'
  | 'storage_capacity_mwh'
  | 'required_profit_spread_yuan_per_mwh'
  | 'degradation_cost_yuan_per_mwh'
  | 'variable_fee_yuan_per_mwh'
  | 'risk_margin_yuan_per_mwh';
type PercentField = 'soc_initial' | 'soc_min' | 'soc_max' | 'soc_terminal_target' | 'eta_charge' | 'eta_discharge';
type StepField = 'min_charge_steps' | 'min_discharge_steps';

function readNumber(event: Event) {
  return Number((event.target as HTMLInputElement).value);
}

function updateNumeric(field: NumericField, event: Event) {
  const value = readNumber(event);
  if (Number.isFinite(value)) {
    props.model[field] = value;
  }
}

function updatePercent(field: PercentField, event: Event) {
  const value = readNumber(event);
  if (Number.isFinite(value)) {
    props.model[field] = Math.min(1, Math.max(0, value / 100)) as never;
  }
}

function percentValue(field: PercentField) {
  const value = props.model[field] ?? 0;
  return Number((value * 100).toFixed(2));
}

function updateStepHours(field: StepField, event: Event) {
  const value = readNumber(event);
  if (Number.isFinite(value)) {
    props.model[field] = Math.max(1, Math.round((value * 60) / props.model.time_step_min));
  }
}

function stepHours(field: StepField) {
  return Number(((props.model[field] * props.model.time_step_min) / 60).toFixed(2));
}
</script>

<template>
  <section class="dashboard-card parameter-form" data-test="storage-parameter-form">
    <div class="dashboard-card__header">
      <h3>策略信息</h3>
      <span>填写参数</span>
    </div>

    <div class="parameter-form__grid">
      <label>
        <span>策略名称</span>
        <input name="strategy_name" :value="strategyName" @input="$emit('update:strategyName', ($event.target as HTMLInputElement).value)" />
      </label>
      <label>
        <span>额定充电功率</span>
        <input
          name="p_charge_max_mw"
          type="number"
          min="0"
          step="1"
          :value="model.p_charge_max_mw"
          @input="updateNumeric('p_charge_max_mw', $event)"
        />
        <small>MW</small>
      </label>
      <label>
        <span>充电出力上限</span>
        <input :value="(-model.p_charge_max_mw).toFixed(2)" disabled />
        <small>MW</small>
      </label>
      <label>
        <span>放电出力上限</span>
        <input
          name="p_discharge_max_mw"
          type="number"
          min="0"
          step="1"
          :value="model.p_discharge_max_mw"
          @input="updateNumeric('p_discharge_max_mw', $event)"
        />
        <small>MW</small>
      </label>
      <label>
        <span>储能容量</span>
        <input
          name="storage_capacity_mwh"
          type="number"
          min="0"
          step="1"
          :value="model.storage_capacity_mwh"
          @input="updateNumeric('storage_capacity_mwh', $event)"
        />
        <small>MWh</small>
      </label>
      <label>
        <span>目标收益价差</span>
        <input
          name="required_profit_spread_yuan_per_mwh"
          type="number"
          step="1"
          :value="model.required_profit_spread_yuan_per_mwh"
          @input="updateNumeric('required_profit_spread_yuan_per_mwh', $event)"
        />
        <small>元/MWh</small>
      </label>
      <label>
        <span>初始荷电状态(SOC)</span>
        <input name="soc_initial" type="number" min="0" max="100" step="0.1" :value="percentValue('soc_initial')" @input="updatePercent('soc_initial', $event)" />
        <small>%</small>
      </label>
      <label>
        <span>荷电状态(SOC)上限</span>
        <input name="soc_max" type="number" min="0" max="100" step="0.1" :value="percentValue('soc_max')" @input="updatePercent('soc_max', $event)" />
        <small>%</small>
      </label>
      <label>
        <span>荷电状态(SOC)下限</span>
        <input name="soc_min" type="number" min="0" max="100" step="0.1" :value="percentValue('soc_min')" @input="updatePercent('soc_min', $event)" />
        <small>%</small>
      </label>
      <label>
        <span>期末荷电状态</span>
        <input
          name="soc_terminal_target"
          type="number"
          min="0"
          max="100"
          step="0.1"
          :value="percentValue('soc_terminal_target')"
          @input="updatePercent('soc_terminal_target', $event)"
        />
        <small>%</small>
      </label>
      <label>
        <span>充电转换效率</span>
        <input name="eta_charge" type="number" min="0" max="100" step="0.1" :value="percentValue('eta_charge')" @input="updatePercent('eta_charge', $event)" />
        <small>%</small>
      </label>
      <label>
        <span>放电转换效率</span>
        <input
          name="eta_discharge"
          type="number"
          min="0"
          max="100"
          step="0.1"
          :value="percentValue('eta_discharge')"
          @input="updatePercent('eta_discharge', $event)"
        />
        <small>%</small>
      </label>
      <label>
        <span>最小连续充电时间</span>
        <input name="min_charge_hours" type="number" min="0.25" step="0.25" :value="stepHours('min_charge_steps')" @input="updateStepHours('min_charge_steps', $event)" />
        <small>h</small>
      </label>
      <label>
        <span>最小连续放电时间</span>
        <input
          name="min_discharge_hours"
          type="number"
          min="0.25"
          step="0.25"
          :value="stepHours('min_discharge_steps')"
          @input="updateStepHours('min_discharge_steps', $event)"
        />
        <small>h</small>
      </label>
      <label>
        <span>度电退化成本</span>
        <input
          name="degradation_cost_yuan_per_mwh"
          type="number"
          min="0"
          step="0.1"
          :value="model.degradation_cost_yuan_per_mwh"
          @input="updateNumeric('degradation_cost_yuan_per_mwh', $event)"
        />
        <small>元/MWh</small>
      </label>
      <label>
        <span>交易变动费用</span>
        <input
          name="variable_fee_yuan_per_mwh"
          type="number"
          min="0"
          step="0.1"
          :value="model.variable_fee_yuan_per_mwh"
          @input="updateNumeric('variable_fee_yuan_per_mwh', $event)"
        />
        <small>元/MWh</small>
      </label>
      <label>
        <span>风险裕度</span>
        <input
          name="risk_margin_yuan_per_mwh"
          type="number"
          min="0"
          step="0.1"
          :value="model.risk_margin_yuan_per_mwh"
          @input="updateNumeric('risk_margin_yuan_per_mwh', $event)"
        />
        <small>元/MWh</small>
      </label>
    </div>

    <button data-test="generate-storage-strategy" type="button" :disabled="loading" @click="$emit('generate')">
      {{ loading ? '计算中...' : '生成策略' }}
    </button>
  </section>
</template>

<style scoped>
.parameter-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 32px;
}

.parameter-form label {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr) 68px;
  align-items: center;
  gap: 8px;
}

.parameter-form span,
.parameter-form small {
  color: var(--color-muted);
  font-size: 12px;
}

.parameter-form input {
  min-width: 0;
  border: 1px solid rgba(143, 155, 186, 0.24);
  border-radius: 4px;
  padding: 8px 10px;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.03);
}

.parameter-form input:disabled {
  color: rgba(255, 255, 255, 0.55);
  background: rgba(255, 255, 255, 0.02);
}

.parameter-form button {
  justify-self: end;
  margin-top: 16px;
  border: 1px solid rgba(0, 242, 254, 0.4);
  border-radius: 4px;
  padding: 9px 16px;
  color: var(--color-primary);
  background: rgba(0, 242, 254, 0.08);
  cursor: pointer;
}

.parameter-form button:disabled {
  cursor: wait;
  opacity: 0.6;
}

@media (max-width: 980px) {
  .parameter-form__grid {
    grid-template-columns: 1fr;
  }

  .parameter-form label {
    grid-template-columns: 1fr;
  }
}
</style>
