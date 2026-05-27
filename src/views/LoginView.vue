<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = '请填写用户名和密码'
    return
  }
  loading.value = true
  error.value = ''
  try {
    // TODO: 对接真实API
    if (username.value === 'admin' && password.value === 'admin123') {
      localStorage.setItem('admin_token', 'demo-token')
      router.push('/')
    } else {
      error.value = '用户名或密码错误'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <p class="text-4xl mb-3">🎙️</p>
        <h1 class="text-xl font-bold text-white">TalkFlow 管理后台</h1>
        <p class="text-gray-500 text-xs mt-1">仅限管理员访问</p>
      </div>
      <div class="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800">
        <div v-if="error" class="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {{ error }}
        </div>
        <div class="mb-4">
          <label class="block text-gray-400 text-sm mb-1.5">用户名</label>
          <input v-model="username" type="text" placeholder="管理员用户名"
            class="w-full bg-gray-900 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none text-sm"
            @keydown.enter="handleLogin" />
        </div>
        <div class="mb-6">
          <label class="block text-gray-400 text-sm mb-1.5">密码</label>
          <input v-model="password" type="password" placeholder="输入密码"
            class="w-full bg-gray-900 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none text-sm"
            @keydown.enter="handleLogin" />
        </div>
        <button
          class="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg text-white font-medium transition"
          :disabled="loading" @click="handleLogin">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </div>
    </div>
  </div>
</template>
