<template>
  <div class="dicts-view">
    <el-row :gutter="16">
      <!-- 左侧：字典类型 -->
      <el-col :span="10">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>字典类型</span>
              <el-button type="primary" size="small" @click="handleAddType">
                <el-icon><Plus /></el-icon>新增
              </el-button>
            </div>
          </template>
          <el-table
            :data="dictTypes"
            highlight-current-row
            border
            stripe
            @current-change="handleTypeSelect"
          >
            <el-table-column prop="name" label="字典名称" min-width="120" />
            <el-table-column prop="code" label="字典编码" min-width="120" />
            <el-table-column prop="status" label="状态" width="80" align="center">
              <template #default="{ row }">
                <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
                  {{ row.status === 1 ? '正常' : '停用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click.stop="handleEditType(row)">编辑</el-button>
                <el-popconfirm title="确定删除？" @confirm="handleDeleteType(row)">
                  <template #reference>
                    <el-button type="danger" link size="small" @click.stop>删除</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 右侧：字典数据 -->
      <el-col :span="14">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>字典数据 {{ currentType ? `- ${currentType.name}` : '' }}</span>
              <el-button type="primary" size="small" :disabled="!currentType" @click="handleAddData">
                <el-icon><Plus /></el-icon>新增
              </el-button>
            </div>
          </template>
          <el-table :data="currentDictData" border stripe>
            <el-table-column prop="label" label="字典标签" min-width="100" />
            <el-table-column prop="value" label="字典值" min-width="80" />
            <el-table-column prop="cssClass" label="CSS类" width="120">
              <template #default="{ row }">
                <el-tag v-if="row.cssClass" :class="row.cssClass" size="small">{{ row.cssClass }}</el-tag>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" width="70" align="center" />
            <el-table-column prop="status" label="状态" width="80" align="center">
              <template #default="{ row }">
                <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
                  {{ row.status === 1 ? '正常' : '停用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="handleEditData(row)">编辑</el-button>
                <el-popconfirm title="确定删除？" @confirm="handleDeleteData(row)">
                  <template #reference>
                    <el-button type="danger" link size="small">删除</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-if="!currentType" description="请在左侧选择字典类型" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 字典类型对话框 -->
    <el-dialog
      v-model="typeDialogVisible"
      :title="isEditType ? '编辑字典类型' : '新增字典类型'"
      width="500px"
      destroy-on-close
    >
      <el-form ref="typeFormRef" :model="typeForm" :rules="typeRules" label-width="100px">
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="typeForm.name" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典编码" prop="code">
          <el-input v-model="typeForm.code" placeholder="请输入字典编码" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="typeForm.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="typeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitType">确定</el-button>
      </template>
    </el-dialog>

    <!-- 字典数据对话框 -->
    <el-dialog
      v-model="dataDialogVisible"
      :title="isEditData ? '编辑字典数据' : '新增字典数据'"
      width="500px"
      destroy-on-close
    >
      <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px">
        <el-form-item label="字典标签" prop="label">
          <el-input v-model="dataForm.label" placeholder="请输入字典标签" />
        </el-form-item>
        <el-form-item label="字典值" prop="value">
          <el-input v-model="dataForm.value" placeholder="请输入字典值" />
        </el-form-item>
        <el-form-item label="CSS类名">
          <el-input v-model="dataForm.cssClass" placeholder="请输入CSS类名" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="dataForm.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="dataForm.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dataDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitData">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

interface DictType {
  id: number
  name: string
  code: string
  status: number
}

interface DictData {
  id: number
  typeCode: string
  label: string
  value: string
  cssClass: string
  sort: number
  status: number
}

const dictTypes = ref<DictType[]>([
  { id: 1, name: '用户性别', code: 'sys_user_gender', status: 1 },
  { id: 2, name: '系统开关', code: 'sys_normal_disable', status: 1 },
  { id: 3, name: '通知类型', code: 'sys_notice_type', status: 1 },
  { id: 4, name: '消息状态', code: 'sys_msg_status', status: 1 },
  { id: 5, name: 'AI模型类型', code: 'ai_model_type', status: 1 },
])

const dictDataMap = ref<Record<string, DictData[]>>({
  sys_user_gender: [
    { id: 101, typeCode: 'sys_user_gender', label: '男', value: '0', cssClass: '', sort: 1, status: 1 },
    { id: 102, typeCode: 'sys_user_gender', label: '女', value: '1', cssClass: '', sort: 2, status: 1 },
    { id: 103, typeCode: 'sys_user_gender', label: '未知', value: '2', cssClass: '', sort: 3, status: 1 },
  ],
  sys_normal_disable: [
    { id: 201, typeCode: 'sys_normal_disable', label: '正常', value: '0', cssClass: 'success', sort: 1, status: 1 },
    { id: 202, typeCode: 'sys_normal_disable', label: '停用', value: '1', cssClass: 'danger', sort: 2, status: 1 },
  ],
  sys_notice_type: [
    { id: 301, typeCode: 'sys_notice_type', label: '系统通知', value: '1', cssClass: 'primary', sort: 1, status: 1 },
    { id: 302, typeCode: 'sys_notice_type', label: '告警通知', value: '2', cssClass: 'warning', sort: 2, status: 1 },
    { id: 303, typeCode: 'sys_notice_type', label: '个人消息', value: '3', cssClass: 'info', sort: 3, status: 1 },
  ],
  sys_msg_status: [
    { id: 401, typeCode: 'sys_msg_status', label: '未读', value: '0', cssClass: 'danger', sort: 1, status: 1 },
    { id: 402, typeCode: 'sys_msg_status', label: '已读', value: '1', cssClass: 'success', sort: 2, status: 1 },
  ],
  ai_model_type: [
    { id: 501, typeCode: 'ai_model_type', label: 'MiMo-7B', value: 'mimo-7b', cssClass: 'primary', sort: 1, status: 1 },
    { id: 502, typeCode: 'ai_model_type', label: 'GPT-4o', value: 'gpt-4o', cssClass: 'success', sort: 2, status: 1 },
    { id: 503, typeCode: 'ai_model_type', label: 'Claude-3.5', value: 'claude-3.5', cssClass: 'warning', sort: 3, status: 1 },
  ],
})

const currentType = ref<DictType | null>(null)
const currentDictData = computed(() => {
  if (!currentType.value) return []
  return dictDataMap.value[currentType.value.code] || []
})

function handleTypeSelect(row: DictType | null) {
  currentType.value = row
}

// --- 字典类型操作 ---
const typeDialogVisible = ref(false)
const isEditType = ref(false)
const typeFormRef = ref<FormInstance>()
const typeForm = reactive<DictType>({ id: 0, name: '', code: '', status: 1 })
const typeRules: FormRules = {
  name: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入字典编码', trigger: 'blur' }],
}

function handleAddType() {
  Object.assign(typeForm, { id: 0, name: '', code: '', status: 1 })
  isEditType.value = false
  typeDialogVisible.value = true
}

function handleEditType(row: DictType) {
  Object.assign(typeForm, { ...row })
  isEditType.value = true
  typeDialogVisible.value = true
}

function handleDeleteType(row: DictType) {
  const idx = dictTypes.value.findIndex(t => t.id === row.id)
  if (idx !== -1) {
    dictTypes.value.splice(idx, 1)
    delete dictDataMap.value[row.code]
    if (currentType.value?.id === row.id) currentType.value = null
  }
  ElMessage.success('删除成功')
}

function handleSubmitType() {
  typeFormRef.value?.validate((valid) => {
    if (!valid) return
    if (isEditType.value) {
      const idx = dictTypes.value.findIndex(t => t.id === typeForm.id)
      if (idx !== -1) Object.assign(dictTypes.value[idx], { ...typeForm })
      ElMessage.success('编辑成功')
    } else {
      const newType = { ...typeForm, id: Date.now() }
      dictTypes.value.push(newType)
      dictDataMap.value[newType.code] = []
      ElMessage.success('新增成功')
    }
    typeDialogVisible.value = false
  })
}

// --- 字典数据操作 ---
const dataDialogVisible = ref(false)
const isEditData = ref(false)
const dataFormRef = ref<FormInstance>()
const dataForm = reactive<DictData>({ id: 0, typeCode: '', label: '', value: '', cssClass: '', sort: 0, status: 1 })
const dataRules: FormRules = {
  label: [{ required: true, message: '请输入字典标签', trigger: 'blur' }],
  value: [{ required: true, message: '请输入字典值', trigger: 'blur' }],
}

function handleAddData() {
  if (!currentType.value) return
  Object.assign(dataForm, { id: 0, typeCode: currentType.value.code, label: '', value: '', cssClass: '', sort: 0, status: 1 })
  isEditData.value = false
  dataDialogVisible.value = true
}

function handleEditData(row: DictData) {
  Object.assign(dataForm, { ...row })
  isEditData.value = true
  dataDialogVisible.value = true
}

function handleDeleteData(row: DictData) {
  const list = dictDataMap.value[row.typeCode]
  if (list) {
    const idx = list.findIndex(d => d.id === row.id)
    if (idx !== -1) list.splice(idx, 1)
  }
  ElMessage.success('删除成功')
}

function handleSubmitData() {
  dataFormRef.value?.validate((valid) => {
    if (!valid) return
    const list = dictDataMap.value[dataForm.typeCode]
    if (!list) return
    if (isEditData.value) {
      const idx = list.findIndex(d => d.id === dataForm.id)
      if (idx !== -1) Object.assign(list[idx], { ...dataForm })
      ElMessage.success('编辑成功')
    } else {
      list.push({ ...dataForm, id: Date.now() })
      ElMessage.success('新增成功')
    }
    dataDialogVisible.value = false
  })
}
</script>

<style scoped>
.dicts-view {
  padding: 4px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
