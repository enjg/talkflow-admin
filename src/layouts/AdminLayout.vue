<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import { menuList, type MenuItem } from '@/config/menu'

const router = useRouter()
const route = useRoute()
const collapsed = ref(false)

// 根据当前路由查找页面标题
function findMenuTitle(items: MenuItem[], path: string): string | null {
  for (const item of items) {
    if (item.path === path) return item.title
    if (item.children) {
      const found = findMenuTitle(item.children, path)
      if (found) return found
    }
  }
  return null
}

const pageTitle = ref('')

// 监听路由变化更新标题
import { watch } from 'vue'
watch(() => route.path, (path) => {
  pageTitle.value = findMenuTitle(menuList, path) || '管理后台'
}, { immediate: true })

function logout() {
  localStorage.removeItem('admin_token')
  router.push('/login')
}
</script>

<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <aside class="admin-aside" :class="{ 'is-collapsed': collapsed }">
      <Sidebar v-model:collapsed="collapsed" />
    </aside>

    <!-- 主内容 -->
    <div class="admin-main">
      <!-- 顶栏 -->
      <header class="admin-header">
        <h1 class="header-title">{{ pageTitle }}</h1>
        <div class="header-right">
          <span class="header-user">管理员</span>
          <el-button type="danger" text size="small" @click="logout">退出</el-button>
        </div>
      </header>

      <!-- 页面内容 -->
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  background-color: #0a0a0f;
}

.admin-aside {
  flex-shrink: 0;
  width: 220px;
  transition: width 0.3s;
  overflow: hidden;
}

.admin-aside.is-collapsed {
  width: 64px;
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 24px;
  background-color: #111118;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
}

.header-title {
  font-size: 14px;
  font-weight: 500;
  color: #9b9baf;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-user {
  font-size: 12px;
  color: #6b6b80;
}

.admin-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}
</style>
