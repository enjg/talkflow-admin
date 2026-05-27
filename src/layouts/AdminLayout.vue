<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const collapsed = ref(false)

const navItems = [
  { path: '/', icon: '📊', label: '数据看板' },
  { path: '/users', icon: '👥', label: '用户管理' },
  { path: '/characters', icon: '🎭', label: '角色管理' },
  { path: '/conversations', icon: '💬', label: '对话管理' },
  { path: '/settings', icon: '⚙️', label: '系统设置' },
]

function logout() {
  localStorage.removeItem('admin_token')
  router.push('/login')
}
</script>

<template>
  <div class="flex h-screen bg-[#0a0a0f]">
    <!-- 侧边栏 -->
    <aside
      :class="['flex flex-col bg-[#111118] border-r border-white/5 transition-all duration-300', collapsed ? 'w-16' : 'w-56']"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 px-4 h-14 border-b border-white/5">
        <span class="text-xl">🎙️</span>
        <span v-if="!collapsed" class="text-sm font-semibold text-white">TalkFlow Admin</span>
      </div>

      <!-- 导航 -->
      <nav class="flex-1 py-3 space-y-1 px-2">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
            route.path === item.path
              ? 'bg-purple-500/15 text-purple-400'
              : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
          ]"
        >
          <span class="text-base">{{ item.icon }}</span>
          <span v-if="!collapsed">{{ item.label }}</span>
        </router-link>
      </nav>

      <!-- 底部 -->
      <div class="p-3 border-t border-white/5">
        <button
          @click="collapsed = !collapsed"
          class="w-full flex items-center justify-center py-2 text-gray-500 hover:text-gray-300 text-sm rounded-lg hover:bg-white/5 transition"
        >
          {{ collapsed ? '→' : '← 收起' }}
        </button>
      </div>
    </aside>

    <!-- 主内容 -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- 顶栏 -->
      <header class="flex items-center justify-between h-14 px-6 bg-[#111118] border-b border-white/5">
        <h1 class="text-sm text-gray-400">{{ navItems.find(i => i.path === route.path)?.label || '管理后台' }}</h1>
        <div class="flex items-center gap-4">
          <span class="text-xs text-gray-500">管理员</span>
          <button @click="logout" class="text-xs text-gray-500 hover:text-red-400 transition">退出</button>
        </div>
      </header>

      <!-- 页面内容 -->
      <main class="flex-1 overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>
