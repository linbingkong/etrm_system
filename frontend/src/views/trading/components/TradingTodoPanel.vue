<script setup lang="ts">
import type { TradingTodo } from '../trading.types';

defineProps<{
  todos: TradingTodo[];
}>();
</script>

<template>
  <section class="dashboard-card trading-todo" data-test="trading-todo-panel">
    <div class="dashboard-card__header">
      <h3>交易待办</h3>
      <span>{{ todos.length }} 项</span>
    </div>
    <router-link v-for="todo in todos" :key="todo.id" :to="todo.path" :class="['trading-todo__item', `is-${todo.priority}`]">
      <strong>{{ todo.title }}</strong>
      <span>{{ todo.module }} · {{ todo.dueText }}</span>
    </router-link>
  </section>
</template>

<style scoped>
.trading-todo {
  display: grid;
  gap: 12px;
  align-content: start;
}

.trading-todo__item {
  display: grid;
  gap: 6px;
  padding: 12px;
  border: 1px solid rgba(0, 242, 254, 0.12);
  border-radius: 4px;
  color: inherit;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.03);
}

.trading-todo__item.is-high {
  border-color: rgba(255, 56, 96, 0.5);
}

.trading-todo strong {
  color: #ffffff;
  font-size: 14px;
}

.trading-todo span {
  color: var(--color-muted);
  font-size: 12px;
}
</style>
