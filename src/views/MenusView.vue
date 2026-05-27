<template>
  <div class="menus-view">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>菜单管理</span>
          <el-button type="primary" @click="handleAdd()">
            <el-icon><Plus /></el-icon>新增菜单
          </el-button>
        </div>
      </template>

      <el-table :data="menuList" row-key="id" default-expand-all border stripe>
        <el-table-column prop="name" label="菜单名称" min-width="180">
          <template #default="{ row }">
            <span v-if="row.icon" style="margin-right: 6px;">
              <el-icon><component :is="row.icon" /></el-icon>
            </span>
            {{ row.name }}
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="图标" width="100" align="center">
          <template #default="{ row }">
            <el-icon v-if="row.icon" :size="18"><component :is="row.icon" /></el-icon>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由路径" min-width="160" />
        <el-table-column prop="sort" label="排序" width="80" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleAdd(row)">新增</el-button>
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm title="确定删除该菜单吗？" @confirm="handleDelete(row)">
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
      :title="isEdit ? '编辑菜单' : '新增菜单'"
      width="600px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="上级菜单">
          <el-tree-select
            v-model="form.parentId"
            :data="menuTreeOptions"
            :props="{ label: 'name', value: 'id', children: 'children' }"
            placeholder="选择上级菜单（不选则为顶级）"
            clearable
            check-strictly
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.icon" placeholder="请输入图标名称" />
        </el-form-item>
        <el-form-item label="路由路径" prop="path">
          <el-input v-model="form.path" placeholder="请输入路由路径" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
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

interface MenuItem {
  id: number
  name: string
  icon: string
  path: string
  sort: number
  status: number
  parentId: number | null
  children?: MenuItem[]
}

const menuList = ref<MenuItem[]>([
  {
    id: 1, name: '系统管理', icon: 'Setting', path: '/system', sort: 1, status: 1, parentId: null,
    children: [
      { id: 11, name: '用户管理', icon: 'User', path: '/system/users', sort: 1, status: 1, parentId: 1 },
      { id: 12, name: '角色管理', icon: 'UserFilled', path: '/system/roles', sort: 2, status: 1, parentId: 1 },
      { id: 13, name: '菜单管理', icon: 'Menu', path: '/system/menus', sort: 3, status: 1, parentId: 1 },
      { id: 14, name: '部门管理', icon: 'OfficeBuilding', path: '/system/depts', sort: 4, status: 1, parentId: 1 },
    ]
  },
  {
    id: 2, name: '系统监控', icon: 'Monitor', path: '/monitor', sort: 2, status: 1, parentId: null,
    children: [
      { id: 21, name: '在线用户', icon: 'User', path: '/monitor/online', sort: 1, status: 1, parentId: 2 },
      { id: 22, name: '服务监控', icon: 'Odometer', path: '/monitor/server', sort: 2, status: 1, parentId: 2 },
      { id: 23, name: '定时任务', icon: 'Timer', path: '/monitor/jobs', sort: 3, status: 1, parentId: 2 },
    ]
  },
  {
    id: 3, name: 'AI管理', icon: 'ChatDotRound', path: '/ai', sort: 3, status: 1, parentId: null,
    children: [
      { id: 31, name: '模型配置', icon: 'Connection', path: '/ai/models', sort: 1, status: 1, parentId: 3 },
      { id: 32, name: '对话管理', icon: 'ChatLineRound', path: '/ai/conversations', sort: 2, status: 1, parentId: 3 },
    ]
  },
])

const menuTreeOptions = computed(() => {
  return [{ id: 0, name: '顶级菜单', children: menuList.value }] as any[]
})

const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const defaultForm = (): MenuItem => ({
  id: 0,
  name: '',
  icon: '',
  path: '',
  sort: 0,
  status: 1,
  parentId: null,
})

const form = reactive<MenuItem>(defaultForm())

const rules: FormRules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
}

function handleAdd(parent?: MenuItem) {
  Object.assign(form, defaultForm())
  if (parent) form.parentId = parent.id
  isEdit.value = false
  dialogVisible.value = true
}

function handleEdit(row: MenuItem) {
  Object.assign(form, { ...row, children: undefined })
  isEdit.value = true
  dialogVisible.value = true
}

function handleDelete(row: MenuItem) {
  const removeNode = (list: MenuItem[], id: number): boolean => {
    const idx = list.findIndex(item => item.id === id)
    if (idx !== -1) { list.splice(idx, 1); return true }
    return list.some(item => item.children ? removeNode(item.children, id) : false)
  }
  removeNode(menuList.value, row.id)
  ElMessage.success('删除成功')
}

function handleStatusChange(row: MenuItem) {
  ElMessage.success(`菜单 "${row.name}" 已${row.status ? '启用' : '禁用'}`)
}

function handleSubmit() {
  formRef.value?.validate((valid) => {
    if (!valid) return
    if (isEdit.value) {
      const updateNode = (list: MenuItem[]): boolean => {
        const idx = list.findIndex(item => item.id === form.id)
        if (idx !== -1) { Object.assign(list[idx], form); return true }
        return list.some(item => item.children ? updateNode(item.children) : false)
      }
      updateNode(menuList.value)
      ElMessage.success('编辑成功')
    } else {
      const newId = Date.now()
      const newItem: MenuItem = { ...form, id: newId }
      if (form.parentId) {
        const addToParent = (list: MenuItem[]): boolean => {
          const parent = list.find(item => item.id === form.parentId)
          if (parent) {
            if (!parent.children) parent.children = []
            parent.children.push(newItem)
            return true
          }
          return list.some(item => item.children ? addToParent(item.children) : false)
        }
        addToParent(menuList.value)
      } else {
        menuList.value.push(newItem)
      }
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
  })
}
</script>

<style scoped>
.menus-view {
  padding: 4px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
