<script setup lang="ts">
import type { StorageStrategyDraft } from '../trading.types';

defineProps<{ drafts: StorageStrategyDraft[] }>();
</script>

<template>
  <section class="dashboard-card strategy-list" data-test="storage-strategy-list">
    <div class="dashboard-card__header">
      <h3>策略列表</h3>
      <span>应用至当前申报</span>
    </div>
    <article v-for="draft in drafts" :key="draft.id" :class="[`is-${draft.status}`]">
      <strong>{{ draft.name }}</strong>
      <span>{{ draft.status === 'generated' ? '已生成' : draft.status === 'error' ? '异常' : '草稿' }}</span>
      <small>{{ draft.updatedAt }}</small>
    </article>
  </section>
</template>

<style scoped>
.strategy-list {
  align-self: start;
}

.strategy-list article {
  display: grid;
  gap: 6px;
  margin-top: 12px;
  border: 1px solid rgba(0, 242, 254, 0.12);
  border-radius: 4px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
}

.strategy-list article.is-generated {
  border-color: rgba(0, 230, 118, 0.36);
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
