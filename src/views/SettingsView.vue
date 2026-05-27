<script setup lang="ts">
import { ref } from 'vue'

const settings = ref({
  aiModel: 'mimo-v2.5-pro',
  ttsModel: 'mimo-v2.5-tts',
  rateLimitPerMin: 30,
  maxTokens: 2048,
  features: {
    voiceChat: true,
    customCharacters: true,
    multiLang: true,
    sceneMode: false,
  }
})

function saveSettings() {
  // TODO: 保存到API
  alert('设置已保存')
}
</script>

<template>
  <div class="max-w-2xl space-y-6">
    <!-- AI模型配置 -->
    <div class="bg-[#111118] border border-white/5 rounded-xl p-5">
      <h3 class="text-sm text-gray-400 mb-4">🤖 AI模型配置</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-xs text-gray-500 mb-1">对话模型</label>
          <input v-model="settings.aiModel"
            class="w-full bg-gray-900 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-purple-500 focus:outline-none text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">TTS模型</label>
          <input v-model="settings.ttsModel"
            class="w-full bg-gray-900 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-purple-500 focus:outline-none text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">最大Token数</label>
          <input v-model.number="settings.maxTokens" type="number"
            class="w-full bg-gray-900 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-purple-500 focus:outline-none text-sm" />
        </div>
      </div>
    </div>

    <!-- 功能开关 -->
    <div class="bg-[#111118] border border-white/5 rounded-xl p-5">
      <h3 class="text-sm text-gray-400 mb-4">🔧 功能开关</h3>
      <div class="space-y-3">
        <label v-for="(val, key) in settings.features" :key="key"
          class="flex items-center justify-between py-2 cursor-pointer">
          <span class="text-sm text-gray-300">{{ { voiceChat: '语音对话', customCharacters: '自定义角色', multiLang: '多语言切换', sceneMode: '场景模式' }[key as string] }}</span>
          <div :class="['w-10 h-5 rounded-full transition relative', val ? 'bg-purple-600' : 'bg-gray-700']"
            @click="(settings.features as any)[key as string] = !(settings.features as any)[key as string]">
            <div :class="['absolute top-0.5 w-4 h-4 rounded-full bg-white transition', val ? 'left-5' : 'left-0.5']" />
          </div>
        </label>
      </div>
    </div>

    <!-- 限流配置 -->
    <div class="bg-[#111118] border border-white/5 rounded-xl p-5">
      <h3 class="text-sm text-gray-400 mb-4">🛡️ 限流配置</h3>
      <div>
        <label class="block text-xs text-gray-500 mb-1">每用户每分钟请求上限</label>
        <input v-model.number="settings.rateLimitPerMin" type="number"
          class="w-48 bg-gray-900 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:border-purple-500 focus:outline-none text-sm" />
      </div>
    </div>

    <button @click="saveSettings"
      class="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition">
      保存设置
    </button>
  </div>
</template>
