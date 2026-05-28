<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { getAiCharacters, addAiCharacter, updateAiCharacter, deleteAiCharacter, toggleAiCharacterStatus } from '@/api/config'

// 搜索条件
const searchForm = reactive({
  name: '',
  status: ''
})

// 表格数据
const loading = ref(false)
const tableData = ref([
  { id: 1, name: '阿甘', avatar: '', language: '英语', description: '温暖单纯的南方口音', status: 'active', usageCount: 156 },
  { id: 2, name: '杰克船长', avatar: '', language: '英语', description: '幽默古怪的海盗腔调', status: 'active', usageCount: 132 },
  { id: 3, name: '尤达大师', avatar: '', language: '英语', description: '颠倒语序的智慧', status: 'active', usageCount: 98 },
  { id: 4, name: '钢铁侠', avatar: '', language: '英语', description: '自信幽默的科技天才', status: 'inactive', usageCount: 87 },
  { id: 5, name: '赫敏', avatar: '', language: '英语', description: '聪慧好学的女巫', status: 'active', usageCount: 76 },
])

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 5
})

// 弹窗控制
const dialogVisible = ref(false)
const dialogTitle = ref('新增AI角色')
const formData = reactive({
  id: null as number | null,
  name: '',
  avatar: '',
  language: '',
  description: '',
  status: 'active'
})

// 语言选项
const languageOptions = [
  { label: '英语', value: 'en' },
  { label: '中文', value: 'zh' },
  { label: '日语', value: 'ja' },
  { label: '韩语', value: 'ko' },
  { label: '法语', value: 'fr' },
  { label: '德语', value: 'de' },
  { label: '西班牙语', value: 'es' },
]

// 获取列表
const fetchData = async () => {
  loading.value = true
  try {
    const res = await getAiCharacters({
      ...searchForm,
      page: pagination.current,
      pageSize: pagination.pageSize
    })
    if (res?.data) {
      tableData.value = res.data.list || []
      pagination.total = res.data.total || 0
    }
  } catch (e) {
    // 使用mock数据
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchData()
}

// 重置
const handleReset = () => {
  searchForm.name = ''
  searchForm.status = ''
  handleSearch()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增AI角色'
  formData.id = null
  formData.name = ''
  formData.avatar = ''
  formData.language = ''
  formData.description = ''
  formData.status = 'active'
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑AI角色'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定删除角色"${row.name}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteAiCharacter(row.id)
      ElMessage.success('删除成功')
      fetchData()
    } catch {
      // mock: 直接移除
      tableData.value = tableData.value.filter(item => item.id !== row.id)
      ElMessage.success('删除成功')
    }
  }).catch(() => {})
}

// 切换状态
const handleStatusChange = async (row: any) => {
  const newStatus = row.status === 'active' ? 'inactive' : 'active'
  try {
    await toggleAiCharacterStatus(row.id, newStatus)
    row.status = newStatus
    ElMessage.success('状态更新成功')
  } catch {
    row.status = newStatus
    ElMessage.success('状态更新成功')
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    if (formData.id) {
      await updateAiCharacter(formData.id, formData)
    } else {
      await addAiCharacter(formData)
    }
    ElMessage.success(formData.id ? '更新成功' : '新增成功')
    dialogVisible.value = false
    fetchData()
  } catch {
    // mock
    if (formData.id) {
      const idx = tableData.value.findIndex(item => item.id === formData.id)
      if (idx !== -1) Object.assign(tableData.value[idx], formData)
    } else {
      tableData.value.push({ ...formData, id: Date.now(), usageCount: 0 })
    }
    ElMessage.success(formData.id ? '更新成功' : '新增成功')
    dialogVisible.value = false
  }
}

// 分页变化
const handleCurrentChange = (page: number) => {
  pagination.current = page
  fetchData()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.current = 1
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="p-4 space-y-4">
    <!-- 搜索区域 -->
    <el-card shadow="never" class="!bg-[#111118] !border-white/5">
      <el-form :model="searchForm" inline>
        <el-form-item label="角色名">
          <el-input v-model="searchForm.name" placeholder="请输入角色名" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable>
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card shadow="never" class="!bg-[#111118] !border-white/5">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-white font-medium">AI角色列表</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增角色</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名" width="120">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-sm">
                {{ row.name[0] }}
              </div>
              <span class="text-white">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="language" label="语言" width="100" />
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="usageCount" label="使用次数" width="100" align="center" />
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
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" destroy-on-close>
      <el-form :model="formData" label-width="80px">
        <el-form-item label="角色名" required>
          <el-input v-model="formData.name" placeholder="请输入角色名" />
        </el-form-item>
        <el-form-item label="语言" required>
          <el-select v-model="formData.language" placeholder="请选择语言" class="w-full">
            <el-option v-for="item in languageOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入角色描述" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio value="active">启用</el-radio>
            <el-radio value="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
