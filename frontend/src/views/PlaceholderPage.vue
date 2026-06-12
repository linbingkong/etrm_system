<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const title = computed(() => String(route.meta.title ?? '页面建设中'));
</script>

<template>
  <section class="placeholder-page">
    <h2>{{ title }}</h2>
    <p>页面已在菜单规划中定义，后续按 docs/pages 对应目录补充设计与实现。</p>
  </section>
</template>

<style scoped>
.placeholder-page {
  padding: 24px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
}

.placeholder-page h2 {
  margin: 0 0 8px;
  font-size: 18px;
}

.placeholder-page p {
  margin: 0;
  color: #64748b;
}
</style>
