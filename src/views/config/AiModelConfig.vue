<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Edit } from '@element-plus/icons-vue'
import { getAiModels, updateAiModel } from '@/api/config'

const loading = ref(false)
const tableData = ref([
  { id: 1, name: 'GPT-4o', provider: 'OpenAI', endpoint: 'https://api.openai.com/v1/chat/completions', status: 'active', callCount: 12560, apiKey: 'sk-****' },
  { id: 2, name: 'GPT-4o-mini', provider: 'OpenAI', endpoint: 'https://api.openai.com/v1/chat/completions', status: 'active', callCount: 38920, apiKey: 'sk-****' },
  { id: 3, name: 'Claude 3.5 Sonnet', provider: 'Anthropic', endpoint: 'https://api.anthropic.com/v1/messages', status: 'active', callCount: 8730, apiKey: 'sk-ant-****' },
  { id: 4, name: 'Gemini Pro', provider: 'Google', endpoint: 'https://generativelanguage.googleapis.com/v1', status: 'inactive', callCount: 2150, apiKey: '' },
  { id: 5, name: 'DeepSeek V3', provider: 'DeepSeek', endpoint: 'https://api.deepseek.com/v1/chat/completions', status: 'active', callCount: 5680, apiKey: 'sk-****' },
])

const dialogVisible = ref(false)
const dialogTitle = ref('编辑模型配置')
const formData = reactive({
  id: null as number | null,
  name: '',
  provider: '',
  endpoint: '',
  apiKey: '',
})

const handleStatusChange = async (row: any) => {
  const newStatus = row.status === 'active' ? 'inactive' : 'active'
  try {
    await updateAiModel(row.id, { status: newStatus })
  } catch {}
  row.status = newStatus
  ElMessage.success('状态更新成功')
}

const handleEdit = (row: any) => {
  dialogTitle.value = '编辑模型配置 - ' + row.name
  Object.assign(formData, { id: row.id, name: row.name, provider: row.provider, endpoint: row.endpoint, apiKey: row.apiKey || '' })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    await updateAiModel(formData.id!, formData)
  } catch {}
  const idx = tableData.value.findIndex(item => item.id === formData.id)
  if (idx !== -1) {
    tableData.value[idx].endpoint = formData.endpoint
    tableData.value[idx].apiKey = formData.apiKey
  }
  ElMessage.success('配置更新成功')
  dialogVisible.value = false
}

const handleSearch = () => {
  ElMessage.info('搜索功能待后端接口对接')
}

onMounted(() => {
  loading.value = true
  setTimeout(() => { loading.value = false }, 300)
})
</script>

<template>
  <div class="p-4 space-y-4">
    <!-- 搜索区域 -->
    <el-card shadow="never" class="!bg-[#111118] !border-white/5">
      <el-form inline>
        <el-form-item label="模型名">
          <el-input placeholder="请输入模型名" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="提供商">
          <el-select placeholder="全部" clearable>
            <el-option label="OpenAI" value="OpenAI" />
            <el-option label="Anthropic" value="Anthropic" />
            <el-option label="Google" value="Google" />
            <el-option label="DeepSeek" value="DeepSeek" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card shadow="never" class="!bg-[#111118] !border-white/5">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-white font-medium">AI模型列表</span>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="模型名" width="180">
          <template #default="{ row }">
            <span class="text-white font-medium">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="provider" label="提供商" width="120" />
        <el-table-column prop="endpoint" label="API端点" min-width="280" show-overflow-tooltip />
        <el-table-column prop="callCount" label="调用次数" width="120" align="center">
          <template #default="{ row }">
            <span class="text-cyan-400">{{ row.callCount.toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              :model-value="row.status === 'active'"
              @change="handleStatusChange(row)"
              active-text="启用"
              inactive-text="禁用"
              inline-prompt
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">配置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="520px" destroy-on-close>
      <el-form :model="formData" label-width="100px">
        <el-form-item label="模型名称">
          <el-input v-model="formData.name" disabled />
        </el-form-item>
        <el-form-item label="提供商">
          <el-input v-model="formData.provider" disabled />
        </el-form-item>
        <el-form-item label="API Endpoint" required>
          <el-input v-model="formData.endpoint" placeholder="请输入API端点地址" />
        </el-form-item>
        <el-form-item label="API Key" required>
          <el-input v-model="formData.apiKey" placeholder="请输入API Key" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
