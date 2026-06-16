<script setup lang="ts">
import type { QuickNavItem } from '../dashboard.types';

defineProps<{
  items: QuickNavItem[];
}>();
</script>

<template>
  <section class="dashboard-card quick-nav">
    <div class="dashboard-card__header">
      <h3>快捷导航</h3>
      <span>高频入口</span>
    </div>
    <div class="quick-nav__grid">
      <router-link v-for="item in items" :key="item.path" class="quick-nav__item" :to="item.path">
        <strong>{{ item.title }}</strong>
        <span>{{ item.description }}</span>
      </router-link>
    </div>
  </section>
</template>

<style scoped>
.quick-nav__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.quick-nav__item {
  display: block;
  min-height: 66px;
  padding: 12px;
  border: 1px solid rgba(0, 242, 254, 0.1);
  border-radius: 3px;
  color: #ffffff;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.025);
}

.quick-nav__item:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-glow);
}

.quick-nav__item span {
  display: block;
  margin-top: 6px;
  color: var(--color-muted);
  font-size: 12px;
}
</style>
