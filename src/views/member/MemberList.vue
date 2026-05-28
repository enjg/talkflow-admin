<template>
  <div class="page-container">
    <div class="page-header">
      <h2>会员列表</h2>
      <div class="header-actions">
        <el-input v-model="keyword" placeholder="搜索昵称/手机/邮箱" prefix-icon="Search" clearable style="width:240px" />
        <el-select v-model="statusFilter" placeholder="状态" clearable style="width:120px">
          <el-option label="正常" value="active" />
          <el-option label="冻结" value="frozen" />
          <el-option label="注销" value="cancelled" />
        </el-select>
        <el-select v-model="levelFilter" placeholder="等级" clearable style="width:120px">
          <el-option label="普通" value="normal" />
          <el-option label="银卡" value="silver" />
          <el-option label="金卡" value="gold" />
          <el-option label="钻石" value="diamond" />
        </el-select>
        <el-button type="primary" @click="handleExport">导出CSV</el-button>
      </div>
    </div>

    <el-table :data="members" stripe style="width:100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="昵称" width="140">
        <template #default="{ row }">
          <div style="display:flex;align-items:center;gap:8px">
            <el-avatar :size="32" :src="row.avatar">{{ row.nickname?.[0] }}</el-avatar>
            <span>{{ row.nickname }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机" width="130" />
      <el-table-column prop="email" label="邮箱" width="180" />
      <el-table-column label="等级" width="100">
        <template #default="{ row }">
          <el-tag :type="levelType(row.level)" size="small">{{ row.level }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="points" label="积分" width="80" />
      <el-table-column label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status==='active'?'success':row.status==='frozen'?'danger':'info'" size="small">
            {{ row.status==='active'?'正常':row.status==='frozen'?'冻结':'注销' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="注册时间" width="170" />
      <el-table-column prop="last_login" label="最后登录" width="170" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="showDetail(row)">详情</el-button>
          <el-button link :type="row.status==='active'?'danger':'success'" @click="toggleStatus(row)">
            {{ row.status==='active'?'冻结':'解冻' }}
          </el-button>
          <el-button link type="warning" @click="showAdjust(row)">调积分</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination layout="total, prev, pager, next" :total="total" :page-size="pageSize" v-model:current-page="currentPage" style="margin-top:16px;justify-content:flex-end" />

    <!-- 详情抽屉 -->
    <el-drawer v-model="drawerVisible" title="会员详情" size="400px">
      <template v-if="currentMember">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="昵称">{{ currentMember.nickname }}</el-descriptions-item>
          <el-descriptions-item label="手机">{{ currentMember.phone }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ currentMember.email }}</el-descriptions-item>
          <el-descriptions-item label="等级">{{ currentMember.level }}</el-descriptions-item>
          <el-descriptions-item label="积分">{{ currentMember.points }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ currentMember.status }}</el-descriptions-item>
          <el-descriptions-item label="注册时间">{{ currentMember.created_at }}</el-descriptions-item>
        </el-descriptions>
        <h4 style="margin:16px 0 8px">学习统计</h4>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="总对话数">{{ currentMember.stats?.sessions || 0 }}</el-descriptions-item>
          <el-descriptions-item label="总消息数">{{ currentMember.stats?.messages || 0 }}</el-descriptions-item>
          <el-descriptions-item label="练习时长">{{ currentMember.stats?.minutes || 0 }}分钟</el-descriptions-item>
          <el-descriptions-item label="连续天数">{{ currentMember.stats?.streak || 0 }}天</el-descriptions-item>
        </el-descriptions>
      </template>
    </el-drawer>

    <!-- 调整积分对话框 -->
    <el-dialog v-model="adjustVisible" title="调整积分" width="400px">
      <el-form label-width="80px">
        <el-form-item label="当前积分">{{ adjustMember?.points }}</el-form-item>
        <el-form-item label="调整">
          <el-input-number v-model="adjustAmount" :min="-99999" :max="99999" />
        </el-form-item>
        <el-form-item label="原因">
          <el-input v-model="adjustReason" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="adjustVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmAdjust">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const keyword = ref('')
const statusFilter = ref('')
const levelFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const members = ref<any[]>([])
const drawerVisible = ref(false)
const currentMember = ref<any>(null)
const adjustVisible = ref(false)
const adjustMember = ref<any>(null)
const adjustAmount = ref(0)
const adjustReason = ref('')

const levelType = (level: string) => {
  const map: Record<string, string> = { '普通': 'info', '银卡': '', '金卡': 'warning', '钻石': 'danger' }
  return map[level] || 'info'
}

const showDetail = (row: any) => { currentMember.value = row; drawerVisible.value = true }
const showAdjust = (row: any) => { adjustMember.value = row; adjustAmount.value = 0; adjustReason.value = ''; adjustVisible.value = true }
const toggleStatus = async (row: any) => {
  const action = row.status === 'active' ? '冻结' : '解冻'
  await ElMessageBox.confirm(`确认${action}会员 ${row.nickname}？`, '提示')
  ElMessage.success(`${action}成功`)
}
const confirmAdjust = () => { ElMessage.success('积分调整成功'); adjustVisible.value = false }
const handleExport = () => { ElMessage.info('导出功能开发中') }
</script>

<style scoped>
.page-container { padding: 20px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px; }
.page-header h2 { color: #e0e0e0; font-size: 18px; }
.header-actions { display: flex; gap: 8px; align-items: center; }
</style>
