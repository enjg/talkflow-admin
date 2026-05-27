<template>
  <div class="messages-view">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>消息中心</span>
          <el-button type="primary" size="small" @click="markAllRead">
            <el-icon><Check /></el-icon>全部已读
          </el-button>
        </div>
      </template>

      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane name="system">
          <template #label>
            <el-badge :value="unreadCount('system')" :hidden="unreadCount('system') === 0" :max="99">
              <span style="padding-right: 12px;">系统通知</span>
            </el-badge>
          </template>
        </el-tab-pane>
        <el-tab-pane name="alert">
          <template #label>
            <el-badge :value="unreadCount('alert')" :hidden="unreadCount('alert') === 0" :max="99">
              <span style="padding-right: 12px;">告警通知</span>
            </el-badge>
          </template>
        </el-tab-pane>
        <el-tab-pane name="personal">
          <template #label>
            <el-badge :value="unreadCount('personal')" :hidden="unreadCount('personal') === 0" :max="99">
              <span style="padding-right: 12px;">个人消息</span>
            </el-badge>
          </template>
        </el-tab-pane>
      </el-tabs>

      <div class="message-list">
        <div
          v-for="msg in filteredMessages"
          :key="msg.id"
          class="message-item"
          :class="{ unread: !msg.read }"
          @click="handleViewDetail(msg)"
        >
          <div class="message-header">
            <div class="message-title">
              <el-badge is-dot :hidden="msg.read" type="danger" style="line-height: 1;">
                <span :style="{ fontWeight: msg.read ? 'normal' : 'bold' }">{{ msg.title }}</span>
              </el-badge>
            </div>
            <span class="message-time">{{ msg.createTime }}</span>
          </div>
          <div class="message-preview">{{ msg.content.slice(0, 80) }}{{ msg.content.length > 80 ? '...' : '' }}</div>
          <div class="message-footer">
            <el-tag :type="getTypeTag(msg.type)" size="small">{{ getTypeLabel(msg.type) }}</el-tag>
            <el-button
              v-if="!msg.read"
              type="primary"
              link
              size="small"
              @click.stop="markRead(msg)"
            >标为已读</el-button>
          </div>
        </div>
        <el-empty v-if="filteredMessages.length === 0" description="暂无消息" />
      </div>
    </el-card>

    <!-- 消息详情抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="currentMessage?.title || '消息详情'"
      size="500px"
    >
      <template v-if="currentMessage">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="消息类型">
            <el-tag :type="getTypeTag(currentMessage.type)" size="small">
              {{ getTypeLabel(currentMessage.type) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="发送者">{{ currentMessage.sender }}</el-descriptions-item>
          <el-descriptions-item label="发送时间">{{ currentMessage.createTime }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="currentMessage.read ? 'success' : 'danger'" size="small">
              {{ currentMessage.read ? '已读' : '未读' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
        <div class="message-content-detail">
          <h4>消息内容</h4>
          <p>{{ currentMessage.content }}</p>
        </div>
        <div class="drawer-footer">
          <el-button v-if="!currentMessage.read" type="primary" @click="markRead(currentMessage!)">标为已读</el-button>
          <el-button @click="drawerVisible = false">关闭</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface Message {
  id: number
  type: 'system' | 'alert' | 'personal'
  title: string
  content: string
  sender: string
  read: boolean
  createTime: string
}

const activeTab = ref('system')
const drawerVisible = ref(false)
const currentMessage = ref<Message | null>(null)

const messages = ref<Message[]>([
  { id: 1, type: 'system', title: '系统升级通知', content: '系统将于本周六凌晨2:00-4:00进行版本升级，届时服务将暂时不可用。本次升级包括：1. 新增AI模型管理功能；2. 优化对话响应速度；3. 修复若干已知问题。请各位同事提前做好准备。', sender: '系统管理员', read: false, createTime: '2024-01-15 09:30:00' },
  { id: 2, type: 'system', title: '新功能上线公告', content: 'MiMo-7B模型已成功接入系统，现在可以在AI管理模块中选择使用。该模型在推理和代码生成方面表现优异，建议大家积极试用并反馈意见。', sender: '系统管理员', read: false, createTime: '2024-01-14 14:20:00' },
  { id: 3, type: 'system', title: '安全策略更新', content: '为加强系统安全，已更新密码策略：密码长度不少于8位，必须包含大小写字母和数字。请各位用户及时更新密码。', sender: '安全管理员', read: true, createTime: '2024-01-13 10:00:00' },
  { id: 4, type: 'alert', title: 'CPU使用率告警', content: '服务器 node-01 的CPU使用率已达到92%，超过预设阈值85%。请及时检查服务器负载情况，排查可能导致高负载的原因。建议检查是否有异常进程或突发流量。', sender: '监控系统', read: false, createTime: '2024-01-15 11:45:00' },
  { id: 5, type: 'alert', title: '磁盘空间告警', content: '服务器 node-02 的磁盘使用率已达到88%，剩余空间不足50GB。请及时清理不必要的文件或扩展磁盘容量。', sender: '监控系统', read: false, createTime: '2024-01-15 10:30:00' },
  { id: 6, type: 'alert', title: '数据库连接异常', content: '数据库连接池在 2024-01-15 08:00 出现短暂异常，已自动恢复。当前连接数: 45/100。建议关注数据库性能趋势。', sender: '监控系统', read: true, createTime: '2024-01-15 08:05:00' },
  { id: 7, type: 'personal', title: '审批通知：您的请假申请已通过', content: '您于2024年1月12日提交的请假申请（1月20日-1月22日）已通过部门经理张三的审批。请做好工作交接安排。', sender: '张三', read: false, createTime: '2024-01-15 16:00:00' },
  { id: 8, type: 'personal', title: '会议邀请：AI项目周会', content: '您被邀请参加每周三下午3点的AI项目周会。会议地点：3楼会议室A。请提前准备好本周的工作汇报。下次会议时间：2024年1月17日。', sender: '李四', read: true, createTime: '2024-01-14 17:00:00' },
  { id: 9, type: 'personal', title: '任务分配：前端页面优化', content: '您有一个新任务：优化管理后台的前端页面性能。优先级：高。截止日期：2024年1月25日。请在任务系统中查看详细需求。', sender: '李四', read: false, createTime: '2024-01-14 15:30:00' },
])

const filteredMessages = computed(() => {
  return messages.value.filter(m => m.type === activeTab.value).sort((a, b) => {
    if (a.read === b.read) return 0
    return a.read ? 1 : -1
  })
})

function unreadCount(type: string) {
  return messages.value.filter(m => m.type === type && !m.read).length
}

function getTypeTag(type: string) {
  const map: Record<string, string> = { system: 'primary', alert: 'danger', personal: 'success' }
  return (map[type] || 'info') as any
}

function getTypeLabel(type: string) {
  const map: Record<string, string> = { system: '系统通知', alert: '告警通知', personal: '个人消息' }
  return map[type] || type
}

function handleTabChange() {
  // tab changed
}

function handleViewDetail(msg: Message) {
  currentMessage.value = msg
  drawerVisible.value = true
}

function markRead(msg: Message) {
  msg.read = true
  ElMessage.success('已标为已读')
}

function markAllRead() {
  messages.value.filter(m => m.type === activeTab.value).forEach(m => { m.read = true })
  ElMessage.success('已全部标为已读')
}
</script>

<style scoped>
.messages-view {
  padding: 4px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.message-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.message-item {
  padding: 16px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.message-item:hover {
  border-color: var(--el-color-primary-light-3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.message-item.unread {
  background: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary-light-7);
}
.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.message-title {
  font-size: 15px;
}
.message-time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}
.message-preview {
  font-size: 13px;
  color: var(--el-text-color-regular);
  margin-bottom: 8px;
  line-height: 1.5;
}
.message-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.message-content-detail {
  margin-top: 20px;
}
.message-content-detail h4 {
  margin-bottom: 12px;
  color: var(--el-text-color-primary);
}
.message-content-detail p {
  line-height: 1.8;
  color: var(--el-text-color-regular);
}
.drawer-footer {
  margin-top: 20px;
  text-align: right;
}
</style>
