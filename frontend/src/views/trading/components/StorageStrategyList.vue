<script setup lang="ts">
import type { StorageSavedStrategy } from '../trading.types';

defineProps<{ strategies: StorageSavedStrategy[]; selectedId: string }>();
defineEmits<{ select: [id: string] }>();
</script>

<template>
  <section class="dashboard-card strategy-list" data-test="storage-strategy-list">
    <div class="dashboard-card__header">
      <h3>策略列表</h3>
      <span>选择已保存策略</span>
    </div>

    <div class="strategy-list__body">
      <p v-if="strategies.length === 0" class="strategy-list__empty">暂无保存策略</p>
      <button
        v-for="strategy in strategies"
        :key="strategy.id"
        data-test="saved-storage-strategy"
        type="button"
        :class="[`is-${strategy.status}`, { 'is-selected': strategy.id === selectedId }]"
        @click="$emit('select', strategy.id)"
      >
        <strong>{{ strategy.name }}</strong>
        <span>{{ strategy.stage === 'profit' ? '已测算' : '已生成' }}</span>
        <small>{{ strategy.updatedAt }}</small>
      </button>
    </div>
  </section>
</template>

<style scoped>
.strategy-list {
  align-self: start;
  min-height: 260px;
}

.strategy-list__body {
  display: grid;
  align-content: start;
  gap: 10px;
  margin-top: 12px;
}

.strategy-list__empty {
  margin: 24px 0;
  color: rgba(232, 247, 255, 0.48);
  font-size: 13px;
  text-align: center;
}

.strategy-list__body > button {
  display: grid;
  width: 100%;
  gap: 6px;
  border: 1px solid rgba(143, 155, 186, 0.18);
  border-radius: 6px;
  padding: 12px;
  color: #e8f7ff;
  background:
    linear-gradient(135deg, rgba(0, 242, 254, 0.06), transparent 42%),
    rgba(8, 20, 48, 0.72);
  text-align: left;
  cursor: pointer;
}

.strategy-list__body > button:hover {
  border-color: rgba(0, 242, 254, 0.42);
  background:
    linear-gradient(135deg, rgba(0, 242, 254, 0.1), transparent 42%),
    rgba(10, 30, 70, 0.78);
}

.strategy-list__body > button.is-generated {
  border-color: rgba(0, 230, 118, 0.24);
}

.strategy-list__body > button.is-selected {
  border-color: rgba(0, 242, 254, 0.72);
  box-shadow: 0 0 18px rgba(0, 242, 254, 0.14);
}

.strategy-list strong {
  color: #ffffff;
}

.strategy-list span,
.strategy-list small {
  color: var(--color-muted);
  font-size: 12px;
}
</style>
