<script setup lang="ts">
import type { NoticeItem } from '../dashboard.types';

defineProps<{
  notices: NoticeItem[];
}>();
</script>

<template>
  <section class="dashboard-card notice-panel" data-test="notice-panel">
    <div class="dashboard-card__header">
      <h3>动态通知</h3>
      <span>市场 / 系统</span>
    </div>
    <el-empty v-if="notices.length === 0" description="暂无通知" />
    <div v-for="notice in notices" v-else :key="notice.id" :class="['notice-panel__item', `is-${notice.type}`]">
      <strong>{{ notice.title }}</strong>
      <span>{{ notice.time }}</span>
    </div>
  </section>
</template>

<style scoped>
.notice-panel__item {
  padding: 10px 0;
  border-bottom: 1px solid rgba(0, 242, 254, 0.08);
}

.notice-panel__item strong {
  display: block;
  color: #ffffff;
  font-size: 13px;
  line-height: 1.5;
}

.notice-panel__item span {
  display: block;
  margin-top: 4px;
  color: var(--color-muted);
  font-size: 12px;
}

.notice-panel__item.is-warning strong {
  color: var(--color-warning);
}
</style>
