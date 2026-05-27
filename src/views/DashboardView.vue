<script setup lang="ts">
import { ref, onMounted } from 'vue'

const stats = ref([
  { label: '总用户', value: '-', icon: '👥', color: 'blue' },
  { label: '今日活跃', value: '-', icon: '🔥', color: 'green' },
  { label: '总对话', value: '-', icon: '💬', color: 'purple' },
  { label: '总消息', value: '-', icon: '📝', color: 'yellow' },
  { label: 'AI角色', value: '-', icon: '🎭', color: 'pink' },
  { label: '平均会话时长', value: '-', icon: '⏱️', color: 'cyan' },
])

const recentActivity = ref([])
const popularCharacters = ref([])

onMounted(async () => {
  // TODO: 从API获取真实数据
  stats.value[0].value = '0'
  stats.value[1].value = '0'
  stats.value[2].value = '0'
  stats.value[3].value = '0'
  stats.value[4].value = '8'
  stats.value[5].value = '0m'
})
</script>

<template>
  <div class="space-y-6">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div v-for="s in stats" :key="s.label"
        class="bg-[#111118] border border-white/5 rounded-xl p-4 text-center">
        <div class="text-2xl mb-2">{{ s.icon }}</div>
        <div class="text-xl font-bold text-white">{{ s.value }}</div>
        <div class="text-xs text-gray-500 mt-1">{{ s.label }}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 热门角色 -->
      <div class="bg-[#111118] border border-white/5 rounded-xl p-5">
        <h3 class="text-sm text-gray-400 mb-4">🎭 热门角色排行</h3>
        <div class="space-y-3">
          <div v-for="(char, i) in ['阿甘', '杰克船长', '尤达', '钢铁侠', '赫敏']" :key="char"
            class="flex items-center gap-3">
            <span class="text-xs text-gray-500 w-4">{{ i + 1 }}</span>
            <div class="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                :style="{ width: (100 - i * 15) + '%' }" />
            </div>
            <span class="text-xs text-gray-400 w-16">{{ char }}</span>
          </div>
        </div>
      </div>

      <!-- 最近活动 -->
      <div class="bg-[#111118] border border-white/5 rounded-xl p-5">
        <h3 class="text-sm text-gray-400 mb-4">📋 最近活动</h3>
        <div class="text-center text-gray-600 text-sm py-8">
          暂无活动数据
        </div>
      </div>
    </div>

    <!-- 系统状态 -->
    <div class="bg-[#111118] border border-white/5 rounded-xl p-5">
      <h3 class="text-sm text-gray-400 mb-4">🖥️ 系统状态</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center p-3 bg-white/3 rounded-lg">
          <div class="text-green-400 text-sm">● 运行中</div>
          <div class="text-xs text-gray-500 mt-1">API服务</div>
        </div>
        <div class="text-center p-3 bg-white/3 rounded-lg">
          <div class="text-green-400 text-sm">● 正常</div>
          <div class="text-xs text-gray-500 mt-1">数据库</div>
        </div>
        <div class="text-center p-3 bg-white/3 rounded-lg">
          <div class="text-green-400 text-sm">● 可用</div>
          <div class="text-xs text-gray-500 mt-1">MiMo API</div>
        </div>
        <div class="text-center p-3 bg-white/3 rounded-lg">
          <div class="text-green-400 text-sm">● 正常</div>
          <div class="text-xs text-gray-500 mt-1">TTS服务</div>
        </div>
      </div>
    </div>
  </div>
</template>
