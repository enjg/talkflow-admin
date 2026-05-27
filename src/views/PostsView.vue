<template>
  <div class="posts-view">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>岗位管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增岗位
          </el-button>
        </div>
      </template>

      <el-table :data="postList" border stripe>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="code" label="岗位编码" width="150" />
        <el-table-column prop="name" label="岗位名称" min-width="200" />
        <el-table-column prop="sort" label="排序" width="80" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm title="确定删除该岗位吗？" @confirm="handleDelete(row)">
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
      :title="isEdit ? '编辑岗位' : '新增岗位'"
      width="500px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="岗位编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入岗位编码" />
        </el-form-item>
        <el-form-item label="岗位名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入岗位名称" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="999" />
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
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

interface Post {
  id: number
  code: string
  name: string
  sort: number
  status: number
  createTime: string
}

const postList = ref<Post[]>([
  { id: 1, code: 'CEO', name: '首席执行官', sort: 1, status: 1, createTime: '2024-01-01 00:00:00' },
  { id: 2, code: 'CTO', name: '首席技术官', sort: 2, status: 1, createTime: '2024-01-01 00:00:00' },
  { id: 3, code: 'PM', name: '产品经理', sort: 3, status: 1, createTime: '2024-01-01 00:00:00' },
  { id: 4, code: 'DEV', name: '开发工程师', sort: 4, status: 1, createTime: '2024-01-01 00:00:00' },
  { id: 5, code: 'QA', name: '测试工程师', sort: 5, status: 1, createTime: '2024-01-01 00:00:00' },
  { id: 6, code: 'OPS', name: '运维工程师', sort: 6, status: 1, createTime: '2024-01-01 00:00:00' },
  { id: 7, code: 'HR', name: '人力资源', sort: 7, status: 1, createTime: '2024-01-01 00:00:00' },
  { id: 8, code: 'UI', name: 'UI设计师', sort: 8, status: 0, createTime: '2024-01-01 00:00:00' },
])

const pagination = reactive({ page: 1, pageSize: 10, total: 8 })

const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const defaultForm = (): Post => ({
  id: 0, code: '', name: '', sort: 0, status: 1, createTime: '',
})

const form = reactive<Post>(defaultForm())

const rules: FormRules = {
  code: [{ required: true, message: '请输入岗位编码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }],
}

function handleAdd() {
  Object.assign(form, defaultForm())
  isEdit.value = false
  dialogVisible.value = true
}

function handleEdit(row: Post) {
  Object.assign(form, { ...row })
  isEdit.value = true
  dialogVisible.value = true
}

function handleDelete(row: Post) {
  const idx = postList.value.findIndex(item => item.id === row.id)
  if (idx !== -1) postList.value.splice(idx, 1)
  pagination.total--
  ElMessage.success('删除成功')
}

function handleSubmit() {
  formRef.value?.validate((valid) => {
    if (!valid) return
    if (isEdit.value) {
      const idx = postList.value.findIndex(item => item.id === form.id)
      if (idx !== -1) Object.assign(postList.value[idx], form)
      ElMessage.success('编辑成功')
    } else {
      postList.value.push({
        ...form,
        id: Date.now(),
        createTime: new Date().toLocaleString(),
      })
      pagination.total++
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
  })
}
</script>

<style scoped>
.posts-view {
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
</style>
