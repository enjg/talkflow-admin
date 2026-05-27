<template>
  <div class="depts-view">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>部门管理</span>
          <el-button type="primary" @click="handleAdd()">
            <el-icon><Plus /></el-icon>新增部门
          </el-button>
        </div>
      </template>

      <el-table :data="deptList" row-key="id" default-expand-all border stripe>
        <el-table-column prop="name" label="部门名称" min-width="180" />
        <el-table-column prop="leader" label="负责人" width="120" />
        <el-table-column prop="phone" label="联系电话" width="140" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleAdd(row)">新增</el-button>
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm title="确定删除该部门吗？" @confirm="handleDelete(row)">
              <template #reference>
                <el-button type="danger" link size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑部门' : '新增部门'"
      width="600px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="上级部门">
          <el-tree-select
            v-model="form.parentId"
            :data="deptTreeOptions"
            :props="{ label: 'name', value: 'id', children: 'children' }"
            placeholder="选择上级部门（不选则为顶级）"
            clearable
            check-strictly
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="form.leader" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">停用</el-radio>
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

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

interface Dept {
  id: number
  name: string
  leader: string
  phone: string
  email: string
  status: number
  parentId: number | null
  children?: Dept[]
}

const deptList = ref<Dept[]>([
  {
    id: 1, name: 'TalkFlow科技', leader: '张三', phone: '13800138000', email: 'admin@talkflow.com',
    status: 1, parentId: null,
    children: [
      {
        id: 11, name: '研发部', leader: '李四', phone: '13800138001', email: 'dev@talkflow.com',
        status: 1, parentId: 1,
        children: [
          { id: 111, name: '前端组', leader: '王五', phone: '13800138003', email: 'fe@talkflow.com', status: 1, parentId: 11 },
          { id: 112, name: '后端组', leader: '赵六', phone: '13800138004', email: 'be@talkflow.com', status: 1, parentId: 11 },
        ]
      },
      { id: 12, name: '产品部', leader: '孙七', phone: '13800138002', email: 'product@talkflow.com', status: 1, parentId: 1 },
      { id: 13, name: '运营部', leader: '周八', phone: '13800138005', email: 'ops@talkflow.com', status: 1, parentId: 1 },
      { id: 14, name: '市场部', leader: '吴九', phone: '13800138006', email: 'market@talkflow.com', status: 0, parentId: 1 },
    ]
  },
])

const deptTreeOptions = computed(() => {
  return [{ id: 0, name: '顶级部门', children: deptList.value }] as any[]
})

const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const defaultForm = (): Dept => ({
  id: 0, name: '', leader: '', phone: '', email: '', status: 1, parentId: null,
})

const form = reactive<Dept>(defaultForm())

const rules: FormRules = {
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  leader: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
}

function handleAdd(parent?: Dept) {
  Object.assign(form, defaultForm())
  if (parent) form.parentId = parent.id
  isEdit.value = false
  dialogVisible.value = true
}

function handleEdit(row: Dept) {
  Object.assign(form, { ...row, children: undefined })
  isEdit.value = true
  dialogVisible.value = true
}

function handleDelete(row: Dept) {
  const removeNode = (list: Dept[], id: number): boolean => {
    const idx = list.findIndex(item => item.id === id)
    if (idx !== -1) { list.splice(idx, 1); return true }
    return list.some(item => item.children ? removeNode(item.children, id) : false)
  }
  removeNode(deptList.value, row.id)
  ElMessage.success('删除成功')
}

function handleSubmit() {
  formRef.value?.validate((valid) => {
    if (!valid) return
    if (isEdit.value) {
      const updateNode = (list: Dept[]): boolean => {
        const idx = list.findIndex(item => item.id === form.id)
        if (idx !== -1) { Object.assign(list[idx], form); return true }
        return list.some(item => item.children ? updateNode(item.children) : false)
      }
      updateNode(deptList.value)
      ElMessage.success('编辑成功')
    } else {
      const newId = Date.now()
      const newItem: Dept = { ...form, id: newId }
      if (form.parentId) {
        const addToParent = (list: Dept[]): boolean => {
          const parent = list.find(item => item.id === form.parentId)
          if (parent) {
            if (!parent.children) parent.children = []
            parent.children.push(newItem)
            return true
          }
          return list.some(item => item.children ? addToParent(item.children) : false)
        }
        addToParent(deptList.value)
      } else {
        deptList.value.push(newItem)
      }
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
  })
}
</script>

<style scoped>
.depts-view {
  padding: 4px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
