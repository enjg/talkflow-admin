<template>
  <div class="menu-manage">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>菜单管理</span>
          <el-button type="primary" @click="handleAdd(null)">
            <el-icon><Plus /></el-icon>
            新增菜单
          </el-button>
        </div>
      </template>

      <el-table
        :data="menuList"
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        border
        stripe
      >
        <el-table-column prop="title" label="菜单名称" min-width="180" />
        <el-table-column prop="icon" label="图标" width="100" align="center">
          <template #default="{ row }">
            <el-icon v-if="row.icon">
              <component :is="row.icon" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="typeTagMap[row.type]?.type || 'info'" size="small">
              {{ typeTagMap[row.type]?.label || '未知' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" align="center" />
        <el-table-column prop="path" label="路由地址" min-width="150" />
        <el-table-column prop="component" label="组件路径" min-width="150" />
        <el-table-column prop="visible" label="可见" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.visible === 1 ? 'success' : 'danger'" size="small">
              {{ row.visible === 1 ? '显示' : '隐藏' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.type !== 2"
              type="primary"
              link
              size="small"
              @click="handleAdd(row)"
            >
              新增
            </el-button>
            <el-button type="warning" link size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-popconfirm
              title="确定删除该菜单吗？"
              @confirm="handleDelete(row.id)"
            >
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
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="formData.type" @change="handleTypeChange">
            <el-radio-button :value="0">目录</el-radio-button>
            <el-radio-button :value="1">菜单</el-radio-button>
            <el-radio-button :value="2">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentId">
          <el-tree-select
            v-model="formData.parentId"
            :data="menuTree"
            :props="{ label: 'title', value: 'id', children: 'children' }"
            check-strictly
            placeholder="选择上级菜单"
            clearable
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="formData.title" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item v-if="formData.type !== 2" label="路由名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入路由名称" />
        </el-form-item>
        <el-form-item v-if="formData.type !== 2" label="路由地址" prop="path">
          <el-input v-model="formData.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item v-if="formData.type === 1" label="组件路径" prop="component">
          <el-input v-model="formData.component" placeholder="例如: DashboardView">
            <template #prepend>@/views/</template>
            <template #append>.vue</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="formData.type === 2" label="权限标识" prop="permission">
          <el-input v-model="formData.permission" placeholder="例如: system:user:add" />
        </el-form-item>
        <el-form-item v-if="formData.type !== 2" label="图标" prop="icon">
          <el-input v-model="formData.icon" placeholder="请输入图标名称" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item v-if="formData.type !== 2" label="是否可见" prop="visible">
          <el-switch
            v-model="formData.visible"
            :active-value="1"
            :inactive-value="0"
            active-text="显示"
            inactive-text="隐藏"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formData.type !== 2" label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
          />
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getMenuTree, addMenu, updateMenu, deleteMenu } from '@/api/system'

interface MenuItem {
  id: number
  parentId: number
  name: string
  path: string
  component: string
  icon: string
  title: string
  type: number
  sort: number
  visible: number
  status: number
  permission?: string
  remark?: string
  children?: MenuItem[]
}

const typeTagMap: Record<number, { type: string; label: string }> = {
  0: { type: 'primary', label: '目录' },
  1: { type: 'success', label: '菜单' },
  2: { type: 'warning', label: '按钮' },
}

const menuList = ref<MenuItem[]>([])
const menuTree = ref<MenuItem[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const formData = reactive({
  id: undefined as number | undefined,
  parentId: 0,
  name: '',
  path: '',
  component: '',
  icon: '',
  title: '',
  type: 0,
  sort: 0,
  visible: 1,
  status: 1,
  permission: '',
  remark: '',
})

const formRules: FormRules = {
  title: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
  path: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
  name: [{ required: true, message: '请输入路由名称', trigger: 'blur' }],
  component: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
  permission: [{ required: true, message: '请输入权限标识', trigger: 'blur' }],
}

// 加载菜单列表
async function loadMenuList() {
  try {
    const res = await getMenuTree()
    menuList.value = res.data || res
    menuTree.value = [{ id: 0, title: '根目录', children: menuList.value }] as any
  } catch (error) {
    console.error('获取菜单列表失败:', error)
    ElMessage.error('获取菜单列表失败')
  }
}

// 新增
function handleAdd(row: MenuItem | null) {
  isEdit.value = false
  formData.parentId = row ? row.id : 0
  formData.type = row ? (row.type === 0 ? 1 : 2) : 0
  dialogVisible.value = true
}

// 编辑
function handleEdit(row: MenuItem) {
  isEdit.value = true
  Object.assign(formData, {
    id: row.id,
    parentId: row.parentId,
    name: row.name,
    path: row.path,
    component: row.component,
    icon: row.icon,
    title: row.title,
    type: row.type,
    sort: row.sort,
    visible: row.visible,
    status: row.status,
    permission: row.permission || '',
    remark: row.remark || '',
  })
  dialogVisible.value = true
}

// 删除
async function handleDelete(id: number) {
  try {
    await deleteMenu(id)
    ElMessage.success('删除成功')
    loadMenuList()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

// 类型变化
function handleTypeChange() {
  if (formData.type === 2) {
    formData.path = ''
    formData.component = ''
    formData.icon = ''
  }
}

// 提交
async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  try {
    if (isEdit.value && formData.id) {
      await updateMenu(formData.id, formData)
      ElMessage.success('更新成功')
    } else {
      await addMenu(formData)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    loadMenuList()
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新失败' : '新增失败')
  }
}

// 重置表单
function resetForm() {
  formRef.value?.resetFields()
  Object.assign(formData, {
    id: undefined,
    parentId: 0,
    name: '',
    path: '',
    component: '',
    icon: '',
    title: '',
    type: 0,
    sort: 0,
    visible: 1,
    status: 1,
    permission: '',
    remark: '',
  })
}

onMounted(() => {
  loadMenuList()
})
</script>

<style scoped>
.menu-manage {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.box-card {
  width: 100%;
}
</style>
