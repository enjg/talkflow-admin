<template>
  <div class="monitor-view">
    <!-- 服务器信息卡片 -->
    <el-row :gutter="16" class="info-cards">
      <el-col :span="6" v-for="item in serverMetrics" :key="item.label">
        <el-card shadow="hover" class="metric-card">
          <div class="metric-header">
            <el-icon :size="28" :color="item.color"><component :is="item.icon" /></el-icon>
            <div class="metric-info">
              <div class="metric-label">{{ item.label }}</div>
              <div class="metric-value">{{ item.value }}</div>
            </div>
          </div>
          <el-progress
            :percentage="item.percent"
            :color="item.percent > 80 ? '#F56C6C' : item.percent > 60 ? '#E6A23C' : '#67C23A'"
            :stroke-width="8"
            style="margin-top: 12px;"
          />
          <div class="metric-detail">{{ item.detail }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 在线用户 & API统计 -->
    <el-row :gutter="16" style="margin-top: 16px;">
      <el-col :span="8">
        <el-card shadow="never">
          <template #header>
            <span>在线用户</span>
          </template>
          <div class="online-stats">
            <div class="stat-number">
              <el-icon :size="40" color="#409EFF"><User /></el-icon>
              <span class="number">{{ onlineUsers }}</span>
              <span class="unit">人</span>
            </div>
            <el-divider />
            <div class="stat-details">
              <div class="stat-row">
                <span>今日活跃</span>
                <el-tag type="success" size="small">{{ todayActive }}</el-tag>
              </div>
              <div class="stat-row">
                <span>今日新增</span>
                <el-tag type="primary" size="small">{{ todayNew }}</el-tag>
              </div>
              <div class="stat-row">
                <span>总用户数</span>
                <el-tag size="small">{{ totalUsers }}</el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>API请求统计 (最近24小时)</span>
              <el-radio-group v-model="chartPeriod" size="small">
                <el-radio-button value="hour">按小时</el-radio-button>
                <el-radio-button value="day">按天</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-placeholder">
            <div class="chart-bars">
              <div
                v-for="(bar, index) in chartData"
                :key="index"
                class="chart-bar-wrapper"
              >
                <div
                  class="chart-bar"
                  :style="{ height: `${(bar.value / maxChartValue) * 100}%` }"
                ></div>
                <span class="chart-label">{{ bar.label }}</span>
              </div>
            </div>
            <div class="chart-stats">
              <div class="chart-stat-item">
                <span class="label">总请求</span>
                <span class="value">{{ totalRequests.toLocaleString() }}</span>
              </div>
              <div class="chart-stat-item">
                <span class="label">平均响应</span>
                <span class="value">{{ avgResponseTime }}ms</span>
              </div>
              <div class="chart-stat-item">
                <span class="label">成功率</span>
                <span class="value" style="color: #67C23A;">{{ successRate }}%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 服务状态 -->
    <el-card shadow="never" style="margin-top: 16px;">
      <template #header>
        <span>服务状态</span>
      </template>
      <el-row :gutter="16">
        <el-col :span="4" v-for="service in services" :key="service.name">
          <div class="service-item" :class="{ 'service-down': !service.running }">
            <el-icon :size="32" :color="service.running ? '#67C23A' : '#F56C6C'">
              <component :is="service.running ? 'CircleCheckFilled' : 'CircleCloseFilled'" />
            </el-icon>
            <div class="service-name">{{ service.name }}</div>
            <el-tag :type="service.running ? 'success' : 'danger'" size="small">
              {{ service.running ? '运行中' : '已停止' }}
            </el-tag>
            <div class="service-uptime">运行 {{ service.uptime }}</div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { User, CpuFilled, Coin, Connection, UploadFilled, CircleCheckFilled, CircleCloseFilled } from '@element-plus/icons-vue'

const chartPeriod = ref('hour')

const serverMetrics = ref([
  { label: 'CPU使用率', value: '45.2%', percent: 45, icon: 'CpuFilled', color: '#409EFF', detail: '8核 @ 3.6GHz' },
  { label: '内存使用', value: '12.8 / 32 GB', percent: 40, icon: 'Coin', color: '#67C23A', detail: '已用 12.8GB / 32GB' },
  { label: '磁盘使用', value: '186 / 500 GB', percent: 37, icon: 'Connection', color: '#E6A23C', detail: 'SSD NVMe' },
  { label: '网络流量', value: '2.4 MB/s', percent: 24, icon: 'UploadFilled', color: '#909399', detail: '入站 1.2MB/s · 出站 1.2MB/s' },
])

const onlineUsers = ref(256)
const todayActive = ref(1024)
const todayNew = ref(38)
const totalUsers = ref(12860)

const chartData = ref([
  { label: '00', value: 120 }, { label: '02', value: 80 }, { label: '04', value: 45 },
  { label: '06', value: 90 }, { label: '08', value: 350 }, { label: '10', value: 520 },
  { label: '12', value: 680 }, { label: '14', value: 720 }, { label: '16', value: 650 },
  { label: '18', value: 480 }, { label: '20', value: 380 }, { label: '22', value: 250 },
])

const maxChartValue = computed(() => Math.max(...chartData.value.map(d => d.value)))
const totalRequests = ref(245680)
const avgResponseTime = ref(128)
const successRate = ref(99.7)

const services = ref([
  { name: 'API 服务', running: true, uptime: '15天 8小时' },
  { name: 'PostgreSQL', running: true, uptime: '30天 2小时' },
  { name: 'Redis', running: true, uptime: '30天 2小时' },
  { name: 'MiMo-7B', running: true, uptime: '5天 12小时' },
  { name: 'TTS 服务', running: true, uptime: '15天 8小时' },
  { name: 'Celery Worker', running: true, uptime: '15天 8小时' },
])
</script>

<style scoped>
.monitor-view {
  padding: 4px;
}
.info-cards .el-col {
  margin-bottom: 0;
}
.metric-card {
  text-align: center;
}
.metric-header {
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
}
.metric-info {
  flex: 1;
}
.metric-label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
.metric-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-top: 2px;
}
.metric-detail {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 6px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.online-stats {
  text-align: center;
}
.stat-number {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
}
.stat-number .number {
  font-size: 48px;
  font-weight: 700;
  color: var(--el-color-primary);
}
.stat-number .unit {
  font-size: 16px;
  color: var(--el-text-color-secondary);
}
.stat-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chart-placeholder {
  min-height: 260px;
}
.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 200px;
  padding: 0 8px;
}
.chart-bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
}
.chart-bar {
  width: 100%;
  max-width: 40px;
  background: linear-gradient(to top, var(--el-color-primary), var(--el-color-primary-light-3));
  border-radius: 4px 4px 0 0;
  min-height: 4px;
  transition: height 0.3s;
}
.chart-label {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}
.chart-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}
.chart-stat-item {
  text-align: center;
}
.chart-stat-item .label {
  display: block;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.chart-stat-item .value {
  display: block;
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-top: 4px;
}
.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 12px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  transition: all 0.2s;
}
.service-item:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}
.service-item.service-down {
  background: var(--el-color-danger-light-9);
}
.service-name {
  font-weight: 500;
  color: var(--el-text-color-primary);
}
.service-uptime {
  font-size: 11px;
  color: var(--el-text-color-secondary);
}
</style>
