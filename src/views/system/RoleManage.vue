<template>
  <div class="role-manage">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>角色管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增角色
          </el-button>
        </div>
      </template>

      <!-- 搜索区域 -->
      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="角色名称">
            <el-input v-model="searchForm.name" placeholder="请输入角色名称" clearable />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loadRoleList">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 角色表格 -->
      <el-table :data="roleList" border stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="name" label="角色名称" min-width="150" />
        <el-table-column prop="code" label="角色标识" min-width="150" />
        <el-table-column prop="sort" label="排序" width="80" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="250" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handlePermission(row)">
              权限
            </el-button>
            <el-button type="warning" link size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-popconfirm
              title="确定删除该角色吗？"
              @confirm="handleDelete(row.id)"
            >
              <template #reference>
                <el-button type="danger" link size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadRoleList"
          @current-change="loadRoleList"
        />
      </div>
    </el-card>

    <!-- 新增/编辑角色对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑角色' : '新增角色'"
      width="500px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色标识" prop="code">
          <el-input v-model="formData.code" placeholder="请输入角色标识" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
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

    <!-- 权限分配对话框 -->
    <el-dialog
      v-model="permissionVisible"
      title="分配菜单权限"
      width="500px"
    >
      <div class="permission-header">
        <span>当前角色: <strong>{{ currentRole?.name }}</strong></span>
        <el-button type="primary" link @click="handleCheckAll">全选/取消全选</el-button>
      </div>
      <el-tree
        ref="menuTreeRef"
        :data="menuTree"
        show-checkbox
        node-key="id"
        :default-checked-keys="checkedMenuIds"
        :props="{ label: 'title', children: 'children' }"
        default-expand-all
        check-strictly
      />
      <template #footer>
        <el-button @click="permissionVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSavePermission">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getRoles,
  addRole,
  updateRole,
  deleteRole,
  getRoleMenus,
  assignRoleMenus,
  getMenuTree,
} from '@/api/system'

interface RoleItem {
  id: number
  name: string
  code: string
  sort: number
  status: number
  remark?: string
  createTime?: string
}

interface MenuItem {
  id: number
  title: string
  children?: MenuItem[]
}

const roleList = ref<RoleItem[]>([])
const menuTree = ref<MenuItem[]>([])
const dialogVisible = ref(false)
const permissionVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const menuTreeRef = ref<any>(null)
const currentRole = ref<RoleItem | null>(null)
const checkedMenuIds = ref<number[]>([])
const isCheckAll = ref(false)

// 搜索表单
const searchForm = reactive({
  name: '',
  status: undefined as number | undefined,
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 表单数据
const formData = reactive({
  id: undefined as number | undefined,
  name: '',
  code: '',
  sort: 0,
  status: 1,
  remark: '',
})

// 表单校验规则
const formRules: FormRules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入角色标识', trigger: 'blur' }],
}

// 加载角色列表
async function loadRoleList() {
  try {
    const res = await getRoles({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm,
    })
    const data = res.data || res
    roleList.value = data.list || data.rows || data
    total.value = data.total || roleList.value.length
  } catch (error) {
    console.error('获取角色列表失败:', error)
    ElMessage.error('获取角色列表失败')
  }
}

// 加载菜单树
async function loadMenuTree() {
  try {
    const res = await getMenuTree()
    menuTree.value = res.data || res
  } catch (error) {
    console.error('获取菜单树失败:', error)
  }
}

// 重置搜索
function resetSearch() {
  searchForm.name = ''
  searchForm.status = undefined
  currentPage.value = 1
  loadRoleList()
}

// 新增
function handleAdd() {
  isEdit.value = false
  dialogVisible.value = true
}

// 编辑
function handleEdit(row: RoleItem) {
  isEdit.value = true
  Object.assign(formData, {
    id: row.id,
    name: row.name,
    code: row.code,
    sort: row.sort,
    status: row.status,
    remark: row.remark || '',
  })
  dialogVisible.value = true
}

// 删除
async function handleDelete(id: number) {
  try {
    await deleteRole(id)
    ElMessage.success('删除成功')
    loadRoleList()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

// 分配权限
async function handlePermission(row: RoleItem) {
  currentRole.value = row
  checkedMenuIds.value = []
  permissionVisible.value = true

  try {
    const res = await getRoleMenus(row.id)
    const menuIds = res.data || res
    checkedMenuIds.value = Array.isArray(menuIds) ? menuIds : []
    menuTreeRef.value?.setCheckedKeys(checkedMenuIds.value)
  } catch (error) {
    console.error('获取角色菜单失败:', error)
  }
}

// 全选/取消全选
function handleCheckAll() {
  isCheckAll.value = !isCheckAll.value
  if (isCheckAll.value) {
    const allIds = getAllMenuIds(menuTree.value)
    menuTreeRef.value?.setCheckedKeys(allIds)
  } else {
    menuTreeRef.value?.setCheckedKeys([])
  }
}

// 递归获取所有菜单ID
function getAllMenuIds(menus: MenuItem[]): number[] {
  const ids: number[] = []
  menus.forEach((menu) => {
    ids.push(menu.id)
    if (menu.children && menu.children.length > 0) {
      ids.push(...getAllMenuIds(menu.children))
    }
  })
  return ids
}

// 保存权限
async function handleSavePermission() {
  if (!currentRole.value) return

  const checkedKeys = menuTreeRef.value?.getCheckedKeys() || []
  const halfCheckedKeys = menuTreeRef.value?.getHalfCheckedKeys() || []
  const menuIds = [...checkedKeys, ...halfCheckedKeys]

  try {
    await assignRoleMenus(currentRole.value.id, menuIds)
    ElMessage.success('权限分配成功')
    permissionVisible.value = false
  } catch (error) {
    ElMessage.error('权限分配失败')
  }
}

// 提交表单
async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  try {
    if (isEdit.value && formData.id) {
      await updateRole(formData.id, formData)
      ElMessage.success('更新成功')
    } else {
      await addRole(formData)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    loadRoleList()
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新失败' : '新增失败')
  }
}

// 重置表单
function resetForm() {
  formRef.value?.resetFields()
  Object.assign(formData, {
    id: undefined,
    name: '',
    code: '',
    sort: 0,
    status: 1,
    remark: '',
  })
}

onMounted(() => {
  loadRoleList()
  loadMenuTree()
})
</script>

<style scoped>
.role-manage {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.permission-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.box-card {
  width: 100%;
}
</style>
