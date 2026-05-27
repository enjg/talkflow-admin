<template>
  <div class="jobs-view">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>定时任务</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增任务
          </el-button>
        </div>
      </template>

      <el-table :data="jobList" border stripe>
        <el-table-column prop="name" label="任务名称" min-width="150" />
        <el-table-column prop="cron" label="Cron表达式" width="150" />
        <el-table-column prop="target" label="调用目标" min-width="220" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'running' ? 'success' : 'info'" size="small">
              {{ row.status === 'running' ? '运行中' : '已暂停' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastRun" label="上次执行" width="180" />
        <el-table-column prop="nextRun" label="下次执行" width="180" />
        <el-table-column label="操作" width="260" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleRunOnce(row)">执行一次</el-button>
            <el-button
              :type="row.status === 'running' ? 'warning' : 'success'"
              link size="small"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'running' ? '暂停' : '恢复' }}
            </el-button>
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="info" link size="small" @click="handleViewLog(row)">日志</el-button>
            <el-popconfirm title="确定删除该任务吗？" @confirm="handleDelete(row)">
              <template #reference>
                <el-button type="danger" link size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑任务' : '新增任务'"
      width="600px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="调用目标" prop="target">
          <el-input v-model="form.target" placeholder="请输入调用目标字符串" />
          <div class="form-tip">如: com.talkflow.job.CleanLogJob.execute</div>
        </el-form-item>
        <el-form-item label="Cron表达式" prop="cron">
          <el-input v-model="form.cron" placeholder="如: 0 0/5 * * * ?" />
          <div class="form-tip">格式: 秒 分 时 日 月 周 (如: 0 0 2 * * ? 每天凌晨2点)</div>
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input v-model="form.description" type="textarea" :rows="2" placeholder="请输入任务描述" />
        </el-form-item>
        <el-form-item label="并发执行">
          <el-switch v-model="form.concurrent" active-text="允许" inactive-text="禁止" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio value="running">运行中</el-radio>
            <el-radio value="paused">暂停</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 任务日志抽屉 -->
    <el-drawer
      v-model="logDrawerVisible"
      :title="`任务日志 - ${currentJob?.name || ''}`"
      size="650px"
    >
      <el-timeline>
        <el-timeline-item
          v-for="log in jobLogs"
          :key="log.id"
          :timestamp="log.time"
          :type="log.success ? 'success' : 'danger'"
          placement="top"
        >
          <el-card shadow="never" class="log-card">
            <div class="log-header">
              <el-tag :type="log.success ? 'success' : 'danger'" size="small">
                {{ log.success ? '成功' : '失败' }}
              </el-tag>
              <span class="log-duration">耗时: {{ log.duration }}ms</span>
            </div>
            <div class="log-message">{{ log.message }}</div>
            <div v-if="log.detail" class="log-detail">
              <el-collapse>
                <el-collapse-item title="详细信息">
                  <pre>{{ log.detail }}</pre>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <el-empty v-if="jobLogs.length === 0" description="暂无执行日志" />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

interface Job {
  id: number
  name: string
  cron: string
  target: string
  description: string
  status: 'running' | 'paused'
  concurrent: boolean
  lastRun: string
  nextRun: string
}

interface JobLog {
  id: number
  time: string
  success: boolean
  duration: number
  message: string
  detail?: string
}

const jobList = ref<Job[]>([
  { id: 1, name: '清理系统日志', cron: '0 0 2 * * ?', target: 'com.talkflow.job.CleanLogJob.execute', description: '每天凌晨2点清理30天前的系统日志', status: 'running', concurrent: false, lastRun: '2024-01-15 02:00:00', nextRun: '2024-01-16 02:00:00' },
  { id: 2, name: '生成数据报表', cron: '0 30 8 * * ?', target: 'com.talkflow.job.ReportJob.generate', description: '每天8:30生成前一天的数据报表', status: 'running', concurrent: false, lastRun: '2024-01-15 08:30:00', nextRun: '2024-01-16 08:30:00' },
  { id: 3, name: 'AI模型健康检查', cron: '0 0/5 * * * ?', target: 'com.talkflow.job.ModelHealthCheck.check', description: '每5分钟检查AI模型服务状态', status: 'running', concurrent: true, lastRun: '2024-01-15 14:55:00', nextRun: '2024-01-15 15:00:00' },
  { id: 4, name: 'Redis缓存清理', cron: '0 0 3 * * ?', target: 'com.talkflow.job.CacheCleanJob.clean', description: '每天凌晨3点清理过期缓存', status: 'running', concurrent: false, lastRun: '2024-01-15 03:00:00', nextRun: '2024-01-16 03:00:00' },
  { id: 5, name: '会话超时清理', cron: '0 0/30 * * * ?', target: 'com.talkflow.job.SessionCleanJob.clean', description: '每30分钟清理超时会话', status: 'paused', concurrent: false, lastRun: '2024-01-14 23:30:00', nextRun: '-' },
  { id: 6, name: '数据库备份', cron: '0 0 1 * * ?', target: 'com.talkflow.job.DbBackupJob.backup', description: '每天凌晨1点进行数据库备份', status: 'running', concurrent: false, lastRun: '2024-01-15 01:00:00', nextRun: '2024-01-16 01:00:00' },
  { id: 7, name: '邮件队列处理', cron: '0 0/1 * * * ?', target: 'com.talkflow.job.EmailQueueJob.process', description: '每分钟处理待发送邮件', status: 'running', concurrent: true, lastRun: '2024-01-15 14:59:00', nextRun: '2024-01-15 15:00:00' },
])

const pagination = reactive({ page: 1, pageSize: 10, total: 7 })

const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const defaultForm = (): Job => ({
  id: 0, name: '', cron: '', target: '', description: '', status: 'running', concurrent: false, lastRun: '-', nextRun: '-',
})

const form = reactive<Job>(defaultForm())

const rules: FormRules = {
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  target: [{ required: true, message: '请输入调用目标', trigger: 'blur' }],
  cron: [{ required: true, message: '请输入Cron表达式', trigger: 'blur' }],
}

// --- 日志 ---
const logDrawerVisible = ref(false)
const currentJob = ref<Job | null>(null)
const jobLogs = ref<JobLog[]>([])

function generateMockLogs(jobName: string): JobLog[] {
  return Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    time: `2024-01-${15 - i} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    success: Math.random() > 0.1,
    duration: Math.floor(Math.random() * 5000) + 100,
    message: `任务 "${jobName}" 执行${Math.random() > 0.1 ? '成功' : '失败'}`,
    detail: Math.random() > 0.5 ? `执行参数: {}\n处理记录数: ${Math.floor(Math.random() * 1000)}` : undefined,
  }))
}

function handleAdd() {
  Object.assign(form, defaultForm())
  isEdit.value = false
  dialogVisible.value = true
}

function handleEdit(row: Job) {
  Object.assign(form, { ...row })
  isEdit.value = true
  dialogVisible.value = true
}

function handleDelete(row: Job) {
  const idx = jobList.value.findIndex(j => j.id === row.id)
  if (idx !== -1) { jobList.value.splice(idx, 1); pagination.total-- }
  ElMessage.success('删除成功')
}

function handleRunOnce(row: Job) {
  ElMessage.success(`任务 "${row.name}" 已触发执行`)
}

function handleToggleStatus(row: Job) {
  row.status = row.status === 'running' ? 'paused' : 'running'
  if (row.status === 'paused') row.nextRun = '-'
  else row.nextRun = '即将计算...'
  ElMessage.success(`任务 "${row.name}" 已${row.status === 'running' ? '恢复' : '暂停'}`)
}

function handleViewLog(row: Job) {
  currentJob.value = row
  jobLogs.value = generateMockLogs(row.name)
  logDrawerVisible.value = true
}

function handleSubmit() {
  formRef.value?.validate((valid) => {
    if (!valid) return
    if (isEdit.value) {
      const idx = jobList.value.findIndex(j => j.id === form.id)
      if (idx !== -1) Object.assign(jobList.value[idx], { ...form })
      ElMessage.success('编辑成功')
    } else {
      jobList.value.push({ ...form, id: Date.now(), lastRun: '-', nextRun: '即将计算...' })
      pagination.total++
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
  })
}
</script>

<style scoped>
.jobs-view {
  padding: 4px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
.form-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}
.log-card {
  margin-bottom: 0;
}
.log-card :deep(.el-card__body) {
  padding: 12px;
}
.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.log-duration {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.log-message {
  font-size: 13px;
  color: var(--el-text-color-regular);
  margin-bottom: 8px;
}
.log-detail pre {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
}
</style>
