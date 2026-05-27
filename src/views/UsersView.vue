<script setup lang="ts">
import { ref } from 'vue'

const search = ref('')
const users = ref([
  { id: 1, nickname: '示例用户', created: '2025-05-20', lastActive: '今天', status: 'active', conversations: 12, messages: 156 },
])

const statusMap: Record<string, { label: string; color: string }> = {
  active: { label: '正常', color: 'text-green-400 bg-green-500/10' },
  banned: { label: '封禁', color: 'text-red-400 bg-red-500/10' },
}
</script>

<template>
  <div class="space-y-4">
    <!-- 搜索栏 -->
    <div class="flex items-center gap-3">
      <input v-model="search" type="text" placeholder="搜索用户昵称..."
        class="flex-1 max-w-sm bg-[#111118] text-white rounded-lg px-4 py-2.5 border border-white/10 focus:border-purple-500 focus:outline-none text-sm" />
      <span class="text-xs text-gray-500">共 {{ users.length }} 个用户</span>
    </div>

    <!-- 用户表格 -->
    <div class="bg-[#111118] border border-white/5 rounded-xl overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-white/5">
            <th class="text-left px-4 py-3 text-xs text-gray-500 font-normal">用户</th>
            <th class="text-left px-4 py-3 text-xs text-gray-500 font-normal">注册时间</th>
            <th class="text-left px-4 py-3 text-xs text-gray-500 font-normal">最后活跃</th>
            <th class="text-center px-4 py-3 text-xs text-gray-500 font-normal">对话</th>
            <th class="text-center px-4 py-3 text-xs text-gray-500 font-normal">消息</th>
            <th class="text-center px-4 py-3 text-xs text-gray-500 font-normal">状态</th>
            <th class="text-center px-4 py-3 text-xs text-gray-500 font-normal">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id" class="border-b border-white/3 hover:bg-white/2 transition">
            <td class="px-4 py-3 text-sm text-white">{{ u.nickname }}</td>
            <td class="px-4 py-3 text-xs text-gray-400">{{ u.created }}</td>
            <td class="px-4 py-3 text-xs text-gray-400">{{ u.lastActive }}</td>
            <td class="px-4 py-3 text-xs text-gray-400 text-center">{{ u.conversations }}</td>
            <td class="px-4 py-3 text-xs text-gray-400 text-center">{{ u.messages }}</td>
            <td class="px-4 py-3 text-center">
              <span :class="['px-2 py-0.5 rounded text-xs', statusMap[u.status]?.color]">
                {{ statusMap[u.status]?.label }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <button class="text-xs text-gray-500 hover:text-purple-400 transition">详情</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!users.length" class="text-center py-12 text-gray-600 text-sm">暂无用户数据</div>
    </div>
  </div>
</template>
