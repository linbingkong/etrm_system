<script setup lang="ts">
import type { WorkbenchTask } from '../dashboard.types';

defineProps<{
  tasks: WorkbenchTask[];
}>();
</script>

<template>
  <section class="dashboard-card task-panel" data-test="task-panel">
    <div class="dashboard-card__header">
      <h3>待办任务</h3>
      <span>{{ tasks.length }} 项</span>
    </div>
    <el-empty v-if="tasks.length === 0" description="暂无待办任务" />
    <router-link v-for="task in tasks" v-else :key="task.id" :class="['task-panel__item', `is-${task.priority}`]" :to="task.path">
      <strong>{{ task.title }}</strong>
      <span>{{ task.module }} / {{ task.dueText }}</span>
    </router-link>
  </section>
</template>

<style scoped>
.task-panel__item {
  display: block;
  padding: 12px;
  border-left: 2px solid var(--color-primary);
  color: #ffffff;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.025);
}

.task-panel__item + .task-panel__item {
  margin-top: 10px;
}

.task-panel__item.is-high {
  border-left-color: var(--color-danger);
}

.task-panel__item.is-medium {
  border-left-color: var(--color-warning);
}

.task-panel__item span {
  display: block;
  margin-top: 6px;
  color: var(--color-muted);
  font-size: 12px;
}
</style>
