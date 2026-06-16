<script setup lang="ts">
import type { WorkbenchProfile } from '../dashboard.types';

defineProps<{
  profile: WorkbenchProfile;
}>();

const statusLabel: Record<WorkbenchProfile['marketStatus'], string> = {
  open: '开市中',
  closed: '已闭市',
  settling: '结算中',
};
</script>

<template>
  <header class="workbench-header dashboard-card">
    <div>
      <p class="workbench-header__eyebrow">工作台首页</p>
      <h2>{{ profile.userName }} / {{ profile.roleName }}</h2>
    </div>
    <div class="workbench-header__meta">
      <span>交易日 {{ profile.tradeDate }}</span>
      <span>{{ profile.weather }} {{ profile.temperature }}</span>
      <strong :class="['workbench-header__status', `is-${profile.marketStatus}`]">
        {{ statusLabel[profile.marketStatus] }}
      </strong>
    </div>
  </header>
</template>

<style scoped>
.workbench-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.workbench-header__eyebrow {
  margin: 0 0 6px;
  color: var(--color-primary);
  font-size: 12px;
}

.workbench-header h2 {
  margin: 0;
  color: #ffffff;
  font-size: 20px;
}

.workbench-header__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  color: var(--color-muted);
  font-size: 13px;
}

.workbench-header__status {
  padding: 4px 10px;
  border: 1px solid var(--border-glow);
  border-radius: 3px;
  color: var(--color-primary);
}

.workbench-header__status.is-closed {
  color: var(--color-muted);
}

.workbench-header__status.is-settling {
  color: var(--color-warning);
}

@media (max-width: 768px) {
  .workbench-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .workbench-header__meta {
    justify-content: flex-start;
  }
}
</style>
