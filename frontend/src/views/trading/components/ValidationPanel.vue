<script setup lang="ts">
import type { ValidationItem } from '../trading.types';

defineProps<{
  items: ValidationItem[];
}>();
</script>

<template>
  <section class="dashboard-card validation-panel" data-test="validation-panel">
    <div class="dashboard-card__header">
      <h3>校验结果</h3>
      <span>{{ items.length }} 项</span>
    </div>
    <article v-for="item in items" :key="item.key" :class="[`is-${item.status}`]">
      <strong>{{ item.title }}</strong>
      <span>{{ item.description }}</span>
    </article>
  </section>
</template>

<style scoped>
.validation-panel {
  display: grid;
  gap: 12px;
  align-content: start;
}

.validation-panel article {
  padding: 12px;
  border-left: 3px solid var(--color-primary);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.03);
}

.validation-panel article.is-danger {
  border-left-color: var(--color-danger);
}

.validation-panel article.is-warning {
  border-left-color: var(--color-warning);
}

.validation-panel article.is-success {
  border-left-color: var(--color-success);
}

.validation-panel strong,
.validation-panel span {
  display: block;
}

.validation-panel strong {
  color: #ffffff;
  font-size: 14px;
}

.validation-panel span {
  margin-top: 6px;
  color: var(--color-muted);
  font-size: 12px;
}
</style>
