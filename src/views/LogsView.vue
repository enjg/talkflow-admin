<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

interface LogEntry {
  id: string
  time: string
  level: 'INFO' | 'WARN' | 'ERROR'
  module: string
  message: string
  user?: string
  detail?: string
}

const loading = ref(false)
const searchQuery = ref('')
const levelFilter = ref('')
const dateRange = ref<[Date, Date] | null>(null)
const currentPage = ref(1)
const pageSize = ref(50)
const total = ref(0)
const logs = ref<LogEntry[]>([])
const autoRefresh = ref(false)
let refreshTimer: ReturnType<typeof setInterval> | null = null

const levelOptions = [
  { value: '', label: '全部级别' },
  { value: 'INFO', label: 'INFO' },
  { value: 'WARN', label: 'WARN' },
  { value: 'ERROR', label: 'ERROR' },
]

const levelTagType = (level: string) => {
  const map: Record<string, string> = {
    INFO: 'info',
    WARN: 'warning',
    ERROR: 'danger',
  }
  return (map[level] || 'info') as any
}

const levelTagColor = (level: string) => {
  const map: Record<string, string> = {
    INFO: '',
    WARN: '#e6a23c',
    ERROR: '#f56c6c',
  }
  return map[level] || ''
}

const filteredLogs = computed(() => {
  let result = logs.value
  if (levelFilter.value) {
    result = result.filter(l => l.level === levelFilter.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      l => l.message.toLowerCase().includes(q) ||
           l.module.toLowerCase().includes(q) ||
           (l.user && l.user.toLowerCase().includes(q))
    )
  }
  // Date range filter
  if (dateRange.value && dateRange.value[0] && dateRange.value[1]) {
    const start = dateRange.value[0].getTime()
    const end = dateRange.value[1].getTime() + 86400000 // +1 day
    result = result.filter(l => {
      const t = new Date(l.time).getTime()
      return t >= start && t <= end
    })
  }
  return result
})

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredLogs.value.slice(start, start + pageSize.value)
})

const fetchLogs = async () => {
  loading.value = true
  // Mock data
  setTimeout(() => {
    logs.value = [
      { id: '1', time: '2025-05-27 14:35:02', level: 'INFO', module: 'auth', message: '用户登录成功', user: '张三' },
      { id: '2', time: '2025-05-27 14:33:15', level: 'INFO', module: 'chat', message: '新对话已创建 conv_012', user: '李四' },
      { id: '3', time: '2025-05-27 14:30:00', level: 'WARN', module: 'api', message: 'MiMo API 响应延迟 > 2000ms' },
      { id: '4', time: '2025-05-27 14:28:45', level: 'ERROR', module: 'tts', message: 'TTS 合成失败: 超时', user: '王五' },
      { id: '5', time: '2025-05-27 14:25:30', level: 'INFO', module: 'user', message: '新用户注册', user: '赵六' },
      { id: '6', time: '2025-05-27 14:20:12', level: 'INFO', module: 'chat', message: '消息发送成功 (32 tokens)', user: '张三' },
      { id: '7', time: '2025-05-27 14:18:00', level: 'WARN', module: 'rate-limit', message: '用户请求频率触发限流', user: '孙七' },
      { id: '8', time: '2025-05-27 14:15:33', level: 'INFO', module: 'admin', message: '管理员更新了系统设置' },
      { id: '9', time: '2025-05-27 14:10:05', level: 'ERROR', module: 'db', message: '数据库连接超时，正在重试...' },
      { id: '10', time: '2025-05-27 14:05:22', level: 'INFO', module: 'auth', message: '用户登出', user: '李四' },
      { id: '11', time: '2025-05-27 13:58:00', level: 'INFO', module: 'chat', message: '角色选择: 阿甘', user: '王五' },
      { id: '12', time: '2025-05-27 13:50:11', level: 'WARN', module: 'api', message: 'API 响应体过大 (2.1MB)' },
      { id: '13', time: '2025-05-27 13:45:30', level: 'INFO', module: 'system', message: '定时任务执行完成: 清理过期会话' },
      { id: '14', time: '2025-05-27 13:30:00', level: 'ERROR', module: 'chat', message: '生成回复失败: 模型返回空响应', user: '赵六' },
      { id: '15', time: '2025-05-27 13:20:15', level: 'INFO', module: 'user', message: '用户更新了个人资料', user: '张三' },
    ]
    total.value = logs.value.length
    loading.value = false
  }, 200)
}

const handleSearch = () => {
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const toggleAutoRefresh = (val: boolean) => {
  if (val) {
    refreshTimer = setInterval(() => {
      fetchLogs()
    }, 10000)
  } else {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
  }
}

onMounted(() => {
  fetchLogs()
})

onBeforeUnmount(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})
</script>

<template>
  <div class="logs-view">
    <!-- Toolbar -->
    <el-card shadow="hover" class="mb-4">
      <div class="flex flex-wrap items-center gap-3">
        <el-input
          v-model="searchQuery"
          placeholder="搜索日志内容、模块、用户..."
          clearable
          style="width: 280px"
          @input="handleSearch"
          @clear="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select
          v-model="levelFilter"
          placeholder="日志级别"
          style="width: 140px"
          clearable
          @change="handleSearch"
        >
          <el-option
            v-for="opt in levelOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 280px"
          @change="handleSearch"
        />
        <div class="ml-auto flex items-center gap-3">
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500">自动刷新</span>
            <el-switch
              v-model="autoRefresh"
              @change="toggleAutoRefresh"
              size="small"
            />
          </div>
          <el-button text type="primary" size="small" @click="fetchLogs">
            <el-icon class="mr-1"><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- Table -->
    <el-card shadow="hover">
      <el-table
        :data="paginatedLogs"
        v-loading="loading"
        stripe
        style="width: 100%"
        row-key="id"
      >
        <el-table-column prop="time" label="时间" width="170" />
        <el-table-column prop="level" label="级别" width="90" align="center">
          <template #default="{ row }">
            <el-tag
              :type="levelTagType(row.level)"
              :color="levelTagColor(row.level)"
              size="small"
              effect="dark"
            >
              {{ row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="module" label="模块" width="110">
          <template #default="{ row }">
            <el-tag size="small" effect="plain">{{ row.module }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="message" label="消息内容" min-width="280" show-overflow-tooltip />
        <el-table-column prop="user" label="关联用户" width="110">
          <template #default="{ row }">
            <span v-if="row.user" class="text-sm">{{ row.user }}</span>
            <span v-else class="text-xs text-gray-400">-</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="filteredLogs.length"
          :page-sizes="[20, 50, 100, 200]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>
