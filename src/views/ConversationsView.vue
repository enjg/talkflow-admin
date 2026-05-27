<script setup lang="ts">
import { ref } from 'vue'

const conversations = ref([])
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <span class="text-sm text-gray-400">所有对话记录</span>
      <input type="text" placeholder="搜索对话..."
        class="bg-[#111118] text-white rounded-lg px-4 py-2 border border-white/10 focus:border-purple-500 focus:outline-none text-sm w-64" />
    </div>
    <div class="bg-[#111118] border border-white/5 rounded-xl overflow-hidden">
      <div v-if="!conversations.length" class="text-center py-16 text-gray-600 text-sm">
        暂无对话数据
      </div>
    </div>
  </div>
</template>
