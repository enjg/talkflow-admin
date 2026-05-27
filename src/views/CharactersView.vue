<script setup lang="ts">
import { ref } from 'vue'

const characters = ref([
  { id: 'forrest_gump', name: '阿甘', desc: '温暖单纯的南方口音', type: 'builtin', status: 'active', usage: 156 },
  { id: 'jack_sparrow', name: '杰克船长', desc: '幽默古怪的海盗腔调', type: 'builtin', status: 'active', usage: 132 },
  { id: 'yoda', name: '尤达大师', desc: '颠倒语序的智慧', type: 'builtin', status: 'active', usage: 98 },
  { id: 'tony_stark', name: '钢铁侠', desc: '自信幽默的科技天才', type: 'builtin', status: 'active', usage: 87 },
  { id: 'hermione', name: '赫敏', desc: '聪慧好学的女巫', type: 'builtin', status: 'active', usage: 76 },
  { id: 'vader', name: '达斯维达', desc: '低沉威严的黑暗面', type: 'builtin', status: 'active', usage: 65 },
  { id: 'godfather', name: '教父', desc: '沉稳的意大利口音', type: 'builtin', status: 'active', usage: 54 },
  { id: 'elsa', name: '艾莎', desc: '优雅温柔的女王', type: 'builtin', status: 'active', usage: 43 },
])
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <span class="text-sm text-gray-400">共 {{ characters.length }} 个角色</span>
      <button class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition">
        + 创建角色
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="c in characters" :key="c.id"
        class="bg-[#111118] border border-white/5 rounded-xl p-4 hover:border-purple-500/30 transition">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center text-lg">
            {{ c.name[0] }}
          </div>
          <div>
            <div class="text-sm text-white font-medium">{{ c.name }}</div>
            <div class="text-xs text-gray-500">{{ c.type === 'builtin' ? '内置' : '自定义' }}</div>
          </div>
          <span class="ml-auto text-xs text-green-400">● 启用</span>
        </div>
        <p class="text-xs text-gray-400 mb-3">{{ c.desc }}</p>
        <div class="flex items-center justify-between text-xs text-gray-500">
          <span>使用 {{ c.usage }} 次</span>
          <button class="text-purple-400 hover:text-purple-300">编辑</button>
        </div>
      </div>
    </div>
  </div>
</template>
