<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { menuItems, visibleMenuItems } from './router/menu-items';

const route = useRoute();
const pageTitle = computed(() => String(route.meta.title ?? '工作台'));
const sidebarMenus = computed(() => visibleMenuItems(menuItems));
</script>

<template>
  <el-container class="app-shell">
    <el-aside class="app-shell__aside" width="248px">
      <div class="app-shell__brand">山东电力交易辅助决策系统</div>
      <el-menu router :default-active="$route.path" class="app-shell__menu">
        <el-sub-menu v-for="menu in sidebarMenus" :key="menu.id" :index="menu.path">
          <template #title>{{ menu.title }}</template>
          <el-menu-item v-for="child in menu.children" :key="child.id" :index="child.path">
            {{ child.title }}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="app-shell__header">
        <h1>{{ pageTitle }}</h1>
      </el-header>
      <el-main class="app-shell__main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
