<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi } from '../api/admin'

interface StatCard {
  label: string
  value: number | string
  icon: string
  color: string
  suffix?: string
}

interface PopularCharacter {
  id: string
  name: string
  usage: number
  avatar?: string
}

interface ActivityItem {
  id: string
  content: string
  time: string
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  icon: string
}

interface HealthStatus {
  name: string
  status: 'online' | 'offline' | 'warning'
  label: string
  detail?: string
}

const loading = ref(false)
const stats = ref<StatCard[]>([
  { label: '总用户', value: 0, icon: 'User', color: '#409eff' },
  { label: '今日活跃', value: 0, icon: 'UserFilled', color: '#67c23a' },
  { label: '总对话', value: 0, icon: 'ChatDotRound', color: '#9b59b6' },
  { label: '总消息', value: 0, icon: 'Message', color: '#e6a23c' },
])

const popularCharacters = ref<PopularCharacter[]>([
  { id: '1', name: '阿甘', usage: 156 },
  { id: '2', name: '杰克船长', usage: 132 },
  { id: '3', name: '尤达大师', usage: 98 },
  { id: '4', name: '钢铁侠', usage: 87 },
  { id: '5', name: '赫敏', usage: 76 },
  { id: '6', name: '达斯维达', usage: 65 },
  { id: '7', name: '教父', usage: 54 },
  { id: '8', name: '艾莎', usage: 43 },
])

const healthStatus = ref<HealthStatus[]>([
  { name: 'API 服务', status: 'online', label: '运行中', detail: 'v1.2.0' },
  { name: '数据库', status: 'online', label: '正常', detail: 'SQLite' },
  { name: 'MiMo API', status: 'online', label: '可用', detail: '延迟 120ms' },
  { name: 'TTS 服务', status: 'online', label: '正常', detail: 'MiMo-TTS' },
])

const recentActivity = ref<ActivityItem[]>([
  { id: '1', content: '用户 张三 注册了账号', time: '5 分钟前', type: 'primary', icon: 'UserFilled' },
  { id: '2', content: '用户 李四 与 阿甘 开始了新对话', time: '12 分钟前', type: 'success', icon: 'ChatDotRound' },
  { id: '3', content: '系统检测到 MiMo API 响应延迟升高', time: '30 分钟前', type: 'warning', icon: 'Warning' },
  { id: '4', content: '用户 王五 被管理员封禁', time: '1 小时前', type: 'danger', icon: 'CircleClose' },
  { id: '5', content: '角色 艾莎 被编辑更新', time: '2 小时前', type: 'info', icon: 'Edit' },
])

const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    online: '#67c23a',
    offline: '#f56c6c',
    warning: '#e6a23c',
  }
  return map[status] || '#909399'
}

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    online: 'success',
    offline: 'danger',
    warning: 'warning',
  }
  return map[status] || 'info'
}

const fetchStats = async () => {
  loading.value = true
  try {
    const res = await adminApi.getStats() as any
    if (res) {
      stats.value[0].value = res.totalUsers ?? 0
      stats.value[1].value = res.activeToday ?? 0
      stats.value[2].value = res.totalConversations ?? 0
      stats.value[3].value = res.totalMessages ?? 0
      if (res.popularCharacters) {
        popularCharacters.value = res.popularCharacters
      }
    }
  } catch {
    // Use default mock data
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<template>
  <div class="dashboard-view" v-loading="loading">
    <!-- Stat Cards -->
    <el-row :gutter="16" class="mb-6">
      <el-col :xs="12" :sm="12" :md="6" v-for="(item, index) in stats" :key="index">
        <el-card shadow="hover" class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <el-statistic :value="item.value">
                <template #title>
                  <div class="flex items-center gap-1.5">
                    <el-icon :size="14" :color="item.color">
                      <component :is="item.icon" />
                    </el-icon>
                    <span class="text-xs text-gray-500">{{ item.label }}</span>
                  </div>
                </template>
              </el-statistic>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Middle Row: Popular Characters + Recent Activity -->
    <el-row :gutter="16" class="mb-6">
      <!-- Popular Characters -->
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover" class="h-full">
          <template #header>
            <div class="flex items-center gap-2">
              <el-icon :size="16" color="#9b59b6"><Trophy /></el-icon>
              <span class="text-sm font-medium">热门角色排行</span>
            </div>
          </template>
          <el-table :data="popularCharacters" stripe style="width: 100%" size="small">
            <el-table-column label="#" width="50" align="center">
              <template #default="{ $index }">
                <el-tag
                  :type="$index < 3 ? 'danger' : 'info'"
                  size="small"
                  effect="dark"
                  round
                >
                  {{ $index + 1 }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="角色名称" />
            <el-table-column prop="usage" label="使用次数" width="120" align="center">
              <template #default="{ row }">
                <div class="flex items-center gap-2 justify-center">
                  <el-progress
                    :percentage="(row.usage / popularCharacters[0]?.usage) * 100"
                    :show-text="false"
                    :stroke-width="6"
                    style="width: 80px"
                  />
                  <span class="text-xs">{{ row.usage }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- Recent Activity Timeline -->
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover" class="h-full">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <el-icon :size="16" color="#409eff"><Clock /></el-icon>
                <span class="text-sm font-medium">最近活动</span>
              </div>
              <el-button text size="small" type="primary">查看全部</el-button>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="item in recentActivity"
              :key="item.id"
              :type="item.type"
              :timestamp="item.time"
              placement="top"
            >
              <div class="flex items-center gap-2">
                <el-icon :size="14"><component :is="item.icon" /></el-icon>
                <span class="text-sm">{{ item.content }}</span>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>

    <!-- System Health -->
    <el-card shadow="hover">
      <template #header>
        <div class="flex items-center gap-2">
          <el-icon :size="16" color="#67c23a"><Monitor /></el-icon>
          <span class="text-sm font-medium">系统状态</span>
        </div>
      </template>
      <el-row :gutter="16">
        <el-col :xs="12" :sm="12" :md="6" v-for="item in healthStatus" :key="item.name">
          <el-card shadow="never" class="text-center health-card mb-2">
            <el-tag :type="getStatusType(item.status) as any" effect="dark" round size="small" class="mb-2">
              {{ item.label }}
            </el-tag>
            <div class="text-sm font-medium mt-1">{{ item.name }}</div>
            <div class="text-xs text-gray-500 mt-1" v-if="item.detail">{{ item.detail }}</div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<style scoped>
.stat-card :deep(.el-card__body) {
  padding: 20px;
}
.health-card {
  border: 1px solid var(--el-border-color-lighter);
}
.dark .health-card {
  background: rgba(255, 255, 255, 0.02);
}
</style>
